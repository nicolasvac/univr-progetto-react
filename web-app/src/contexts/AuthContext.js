import React, { useContext, useState, useEffect } from "react"
import { auth, db, analytics, storage, collections, documents } from "../services/firebase"
import {
    createUserWithEmailAndPassword,
    setPersistence,
    signInWithEmailAndPassword,
    browserSessionPersistence,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateEmail as authUpdateEmail,
    updatePassword as authUpdatePassword,
    sendEmailVerification,
    updateProfile as authUpdateProfile
} from "firebase/auth";
import {
    doc,
    setDoc,
    addDoc,
    collection,
    query, limit,
    writeBatch, getDocs,
    updateDoc, where,
    deleteDoc, getDoc, deleteField, orderBy, collectionGroup, runTransaction, Timestamp,
    startAfter, endBefore,
} from "firebase/firestore";
import { logEvent } from 'firebase/analytics';
import { ref, getDownloadURL } from 'firebase/storage'
import axios from 'axios'
import Language from "../components/Language";
import detectBrowserLanguage from 'detect-browser-language'
// import configuration from "../configuration/config";

const PATIENTS_DROPPED = "dropped_patients";

const AuthContext = React.createContext();

/**
 * Use constants in order to avoid typos.
 */
const COLLECTIONS = {
    PATIENTS: "patients",
    CONTROL_GROUP: "control_group_patients",
}

/**
 * Custom hook
 * @returns React context
 */
export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('lang') || detectBrowserLanguage());

    function updateCurrentLanguage(languageCode) {
        setCurrentLanguage(() => languageCode);
        Language.setLanguage(languageCode);
    }

    function getPatientWorkouts(patient_id, rows) {
        return getDocs(query(collection(db, `patients/${patient_id}/workout_entry`), orderBy("time", 'asc'), limit(rows)));
    }

    function verifyEmail() {
        return sendEmailVerification(currentUser);
    }

    /**
     * @description Run transaction that verifies if patient with given ID exists and its owner is the current user.
     * @param {*} appointments List of appointment data time instances.
     * @param {*} patientId Unique patient id.
     * @returns {Promise} Result of transaction.
     */
    function updatePatientAppointments(appointments, patientId) {
        return runTransaction(db, async (transaction) => {

            const patientRef = doc(db, "patients", patientId);

            const patient = await transaction.get(patientRef);

            if (!patient.exists()) {
                throw new Error("Patient does not exist");
            }

            const { doctorId } = patient.data();
            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            // update patient appointments list
            transaction.update(patientRef, { appointments: appointments });

        });
    }

    function modifyPatientVisit(patientId, visitId, data) {
        return runTransaction(db, async (transaction) => {
            const patientRef = doc(db, "patients", patientId);

            const patient = await transaction.get(patientRef);

            if (!patient.exists()) {
                throw new Error("Patient does not exist");
            }

            const { doctorId } = patient.data();
            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            const patientVisit = doc(db, `patients/${patientId}/visits`, visitId);
            transaction.update(patientVisit, data);
        })
    }

    function recoverDroppedPatient(patientId) {
        return runTransaction(db, async (transaction) => {
            const patientRef = doc(db, "patients", patientId);

            const patient = await transaction.get(patientRef);

            if (!patient.exists()) {
                throw new Error("Patient does not exist");
            }

            const { doctorId, dropped } = patient.data();

            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            if (dropped !== undefined && dropped) {
                transaction.update(patientRef, {
                    dropped: false,
                })
            }

        })
    }

    function setPatientDroppedOut(patientId) {
        return runTransaction(db, async (transaction) => {
            const patientRef = doc(db, "patients", patientId);

            const patient = await transaction.get(patientRef);

            if (!patient.exists()) {
                throw new Error("Patient does not exist");
            }

            const { doctorId } = patient.data();

            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            transaction
                .update(patientRef, {
                    dropped: true,
                    droppedAt: Timestamp.now(),
                });
            //.get(patientRef);
        });
    }

    /**
     * 
     * @param {String} patientId Patient unique id
     * @returns Transaction promise
     */
    function dropOutPatient(patientId) {
        return runTransaction(db, async (transaction) => {
            // get patient reference with given uid
            const patientRef = doc(db, "patients", patientId);

            // get patient data
            const patient = await transaction.get(patientRef);

            // verify if it exists
            if (!patient.exists()) {
                throw new Error("Patient does not exist");
            }

            const { doctorId } = patient.data();
            // check for doctor id
            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            // change patient collection in order to drop out
            transaction.set(doc(db, PATIENTS_DROPPED, patientId), {
                ...patient.data(),
                id: patientId,
                droppedAt: Timestamp.now(),
            })
                .delete(patientRef);

            // delete patient from previous collection
            // return transaction.delete(patientRef);
        });
    }

    /**
     * @deprecated
     * @param {*} workouts List of workouts
     * @param {*} patientId Patient uid
     * @returns Promise
     */
    function updatePatientWorkouts(workouts, patientId) {
        return updateDoc(documents.patient(patientId), workouts);
    }

    /**
     * @deprecated
     * @param {*} body 
     * @param {*} patient_id 
     * @param {*} notification_id 
     * @returns 
     */
    function updateNotification(body, patient_id, notification_id) {
        return updateDoc(doc(db, `patients/${patient_id}/notifications`, notification_id), body);
    }

    /**
     * @description Create patient notification
     * @param {*} body Notification body
     * @param {*} patientId Patient unique id
     * @returns {Promise}
     */
    function createNotification(body, patientId) {
        return runTransaction(db, async (transaction) => {
            const patientRef = doc(db, "patients", patientId);

            const patient = await transaction.get(patientRef);

            if (!patient.exists()) {
                throw new Error("Patient does not exist");
            }

            const { doctorId } = patient.data();
            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            const notificationDocRef = doc(collection(db, `patients/${patientId}/notifications`))
            transaction.set(notificationDocRef, body);
        })
        //return setDoc(doc(collection(db, `patients/${patient_id}/notifications`)), body);
    }

    function getNotifications(patient_id) {
        // given patient id return all patient notifications
        return getDocs(query(collection(db, `patients/${patient_id}/notifications`), orderBy("event_time", "desc")));
    }

    /**
     * 
     * @param {object} body Notification body with the patient device token
     * @returns {Promise} Axios Promise result.
     */
    function sendNotification(body) {

        const api = "notification";

        let host = process.env.REACT_APP_SERVER_URL;

        let url = host.concat(api);

        return axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.accessToken}`,
                "Access-Control-Allow-Origin": "*"
            },
        });
    }

    function getUrlNotificationIcon() {
        return getDownloadURL(ref(storage, 'mobile/aovr.png'));
    }

    async function signup(email, password, { firstname, lastname }) {

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        logEvent(analytics, 'sign_up', { providerId: userCredentials.providerId });
        /*const storageRef = ref(storage, 'doctors/' + userCredentials.user.uid + '/avatars/' + file.name);
        const metadata = { contentType: 'image/jpeg' }
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        uploadTask.on('state_changed', (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        console.debug("User doesn't have permission to access the object")
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        console.debug("User canceled the upload")
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        console.debug("Unknown error occurred, inspect error.serverResponse");
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                });
            });*/

        return authUpdateProfile(userCredentials.user, { displayName: `${firstname} ${lastname}` });
    }

    function getPatientNutritionalPlan(uid) {
        return getDocs(collection(db, `patients/${uid}/nutritional_plans`));
    }

    function getNutritionalPlanTemplates() {
        return getDocs(collection(db, "templates_nutritional_plan"));
    }

    function deleteNutritionalPlanTemplate(templateId) {
        const docRef = doc(db, "templates_nutritional_plan", templateId);
        return deleteDoc(docRef);
    }

    function deletePatientVisit(patientId, visitId) {
        const patientVisitRef = doc(db, `patients/${patientId}/visits`, visitId);
        return deleteDoc(patientVisitRef);
    }

    function updateSeenNotificationStatus(patientId, notificationId) {
        // read and write in oneshot: update seen notification value
        return runTransaction(db, async (transaction) => {
            const docRef = doc(db, `patients/${patientId}/notifications`, notificationId);
            const notificationDocument = await transaction.get(docRef);
            if (!notificationDocument.exists()) {
                throw new Error("Document does not exists.");
            }

            const { seen } = notificationDocument.data();
            transaction.update(docRef, { seen: !seen });
        });
    }

    function updatePatientStatus(patientId, newStatus) {
        return runTransaction(db, async (transaction) => transaction
            .update(documents.patient(patientId), {
                status: newStatus,
            })
        );
    }

    /**
     * @description Update patient data by giving id and payload
     * @param {String} patientId Unique patient id
     * @param {Object} data Payload data to update
     * @returns Update document promise
     */
    function updatePatient(patientId, data) {

        return runTransaction(db, async (transaction) => {
            const patientDocRef = doc(db, "patients", patientId);
            let patient = await transaction.get(patientDocRef);

            if (!patient.exists()) {
                throw new Error("Patient does not exists");
            }

            const { doctorId } = patient.data();

            if (doctorId !== currentUser.uid) {
                throw new Error("It's not your patient");
            }

            return transaction.update(patientDocRef, data);

        })
    }

    /**
     * Fetch all the food items from firestore
     * Do not use this function because it consumes reading accesses
     * @returns Promise query
     */
    function getFoods() {
        return getDocs(query(collection(db, "foods"), orderBy('name', 'asc')));
    }

    function searchFoodByName(queryText) {
        const q = query(collection(db, "foods"),
            orderBy('name', 'asc'),
            where('name', '<=', queryText + '\uf8ff'),
            where('name', '>=', queryText),
            limit(25));
        return getDocs(q);
    }

    function getFoodsWithLimit(items) {
        const q = query(collection(db, "foods"), orderBy("name", 'asc'), limit(items))
        return getDocs(q);
    }

    function getFoodsAfter(items, after) {
        const q = query(collection(db, "foods"), orderBy("name", 'asc'), limit(items), startAfter(after));
        return getDocs(q);
    }

    function getFoodsBefore(items, before) {
        const q = query(collection(db, "foods"), orderBy("name", 'asc'), limit(items), endBefore(before));
        return getDocs(q);
    }

    function updateFood(uid, food) {
        return updateDoc(doc(db, "foods", uid), food);
    }

    function getBackendFoods() {

        let host = process.env.REACT_APP_SERVER_URL;

        const api = "all-foods";

        const url = host.concat(api);

        return axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.accessToken}`,
                "Access-Control-Allow-Origin": "*",
            },
        });

    }

    function getDailyPatientNutrients(body) {

        let host = process.env.REACT_APP_SERVER_URL;

        const api = "diet-stats";

        const url = host.concat(api);

        let formData = new FormData();
        formData.append('user_id', body.user_id);
        formData.append('today_date', body.today_date);

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${currentUser.accessToken}`,
                "Access-Control-Allow-Origin": "*"
            }
        }

        return axios.post(url, formData, config);
    }

    /**
     * 
     * @param {string} collection_path Collection path.
     * @returns Firestore Document Reference with generated unique id.
     */
    function newDocRef(collection_path) {
        return doc(collection(db, collection_path))
    }

    function createPatientNutritionalPlan(docRef, data) {
        return setDoc(docRef, data);
    }

    function createNutritionalPlanTemplate(docRef, data) {
        return setDoc(docRef, data);
    }

    function updatePatientNutritionalPlan(data, patient_id, doc_id) {
        return setDoc(doc(db, `patients/${patient_id}/nutritional_plans`, doc_id), data);
    }

    function updateNutritionalPlanTemplate(data, doc_id) {
        return setDoc(doc(db, "templates_nutritional_plan", doc_id), data);
    }

    function updateProfile(data) {
        return authUpdateProfile(currentUser, data);
    }

    function getFoodEntries(patient_id) {
        return getDocs(query(collection(db, `patients/${patient_id}/food_entry`), orderBy("time", "desc")));
    }

    function updateWorkoutEntry(uid, data) {
        return updateDoc(doc(db, "workout_entry", uid), data);
    }

    function removeWorkoutEntry(uid) {
        // given uid workout entry doc
        return deleteDoc(doc(db, "workout_entry", uid));
    }

    function createWorkoutEntry(doc) {
        // add new element
        return addDoc(collection(db, "workout_entry"), doc);
    }

    function getPatients() {
        const q = query(
            collection(db, "patients"),
            where("doctorId", "==", currentUser.uid),
            //orderBy("createdAt", 'asc')
            orderBy("therapyStartDate", 'desc')
        );
        return getDocs(q);
    }

    function getDroppedPatients() {
        const q = query(collection(db, "dropped_patients"), where("doctorId", "==", currentUser.uid));
        return getDocs(q);
    }

    function getPathologies() {
        return getDocs(collection(db, "pathologies"));
    }

    function removePathology(pathologyId) {
        const docRef = doc(db, "pathologies", pathologyId);
        return deleteDoc(docRef)
    }

    function createPathology(docRef, pathology) {
        return setDoc(docRef, pathology);
    }

    function getPathologyById(id) {
        return getDoc(doc(db, "pathologies", id));
    }

    function removeControlGroupPatient(patients) {
        //const batch = writeBatch(db);
        runTransaction(db, async (transaction) => {
            patients.forEach(async (id) => {
                let patientRef = doc(db, COLLECTIONS.CONTROL_GROUP, id);
                let patient = await transaction.get(patientRef);
                if (patient.exists()) {
                    let newRef = doc(db, "patients", id);
                    if (!((await transaction.get(newRef)).exists())) {
                        transaction.set(newRef, patient.data());
                        //batch.set(newRef, patient.data());
                    }
                    else
                        console.debug("patient already exist ", newRef.id);
                } else {
                    console.debug("patient does not exist ", id);
                }
            });
        });
        //return await batch.commit();

    }

    function removeControlGroupPatient_(patientIds) {
        // remove one or more patients
        const batch = writeBatch(db);
        patientIds.forEach(id => {
            batch.delete(doc(db, COLLECTIONS.CONTROL_GROUP, id));
        });
        return batch.commit();
        //return deleteDoc(doc(db, COLLECTIONS.CONTROL_GROUP, patientId));
    }

    function removePatient(patientId) {
        //return deleteDoc(documents.patient(patientId));
        return runTransaction(db, async (transaction) => {
            let patientDocRef = doc(db, "patients", patientId);
            let patientDoc = await transaction.get(patientDocRef);

            if (!patientDoc.exists()) {
                throw new Error(`Patient with uid ${patientId} does not exists`);
            }

            let { doctorId } = patientDoc.data();
            if (doctorId !== currentUser.uid) {
                throw new Error("It's not your patient");
            }

            transaction.set(doc(collection(db, "removed_patients")), {
                ...patientDoc.data(),
                patientId: patientId,
            });

            transaction.delete(patientDocRef);

        })
    }

    function unlinkPatient(patientId) {
        return updateDoc(doc(db, "patients", patientId), { doctorId: deleteField() });
    }

    async function createPatient(patient) {

        // get reference to patients collection
        const patientsRef = collection(db, 'patients');

        // query to get doctor patients with the same new patient email
        const q = query(patientsRef, where('email', '==', patient?.email));

        try {
            const snapshot = await getDocs(q);
            // if there is no patient with same email
            if (snapshot.empty) {
                let data = {
                    ...patient,
                    doctorId: currentUser.uid,
                    createdAt: Timestamp.now(),
                }
                // then add new one
                return addDoc(patientsRef, data);
            } else {
                // the email is already taken
                throw new Error('There exists patient with the same email address');
            }
        } catch (e) {
            throw e;
        }

    }

    function createPatientGroupControl(patient) {
        const collectionRef = collection(db, COLLECTIONS.CONTROL_GROUP);
        const docRef = doc(collectionRef);
        return setDoc(docRef, {
            ...patient,
            doctorId: currentUser.uid,
            createdAt: Timestamp.now(),
        });
    }

    function getPatient(patientId) {
        return getDoc(doc(db, "patients", patientId));
    }

    /**
     * 
     * @param {String} patientId Patient uid
     * @returns get doc promise
     */
    function getPatientById(patientId) {
        return runTransaction(db, async (transaction) => {
            const patientRef = doc(db, "patients", patientId);
            const patient = await transaction.get(patientRef);

            if (patient.exists()) {
                return patient.data();
            } else {
                return (await transaction.get(doc(db, "control_group_patients", patientId))).data();
            }
        })
        //return getDoc(doc(db, collectionName, patientId));
    }

    function getPatientProtected(patientId) {
        return runTransaction(db, async (transaction) => {

            const patientRef = doc(db, "patients", patientId);

            const patient = await transaction.get(patientRef);

            if (!patient.exists()) {
                throw new Error("Patient does not exist");
            }

            const patientData = patient.data();
            if (patientData.doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            } else {
                return ({ ...patientData, uid: patient.id });
            }

        });
    }

    function getStatistics() {
        let host = process.env.REACT_APP_SERVER_URL;

        const api = "patients/statistics";

        const url = host.concat(api);
        return axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.accessToken}`,
                "Access-Control-Allow-Origin": "*"
            }
        })
    }

    function getWorkouts(rowsPerPage) {
        // list of workouts on firestore db
        return getDocs(query(collections.workouts, limit(rowsPerPage)))
    }

    function listWorkouts() {
        return getDocs(collections.workouts);
    }

    function createWorkout(data) {
        return addDoc(collections.workouts, data);
    }

    function updateWorkout(uid, data) {
        return setDoc(doc(db, "workouts", uid), data);
    }

    function deleteInBatch(rows) {
        const batch = writeBatch(db);
        rows.forEach(row => batch.delete(doc(db, "workouts", row)));
        return batch.commit();
    }

    async function login(email, password, rememberMe) {
        if (!rememberMe) {
            return setPersistence(auth, browserSessionPersistence).then(async () => {
                return signInWithEmailAndPassword(auth, email, password)
                    .then((userCredentials) => logEvent(analytics, 'login', { providerId: userCredentials.providerId }));
            });
        } else {
            return signInWithEmailAndPassword(auth, email, password)
                .then((userCredentials) => logEvent(analytics, 'login', { providerId: userCredentials.providerId }));
        }
    }

    function logout() {
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function updateEmail(email) {
        return authUpdateEmail(currentUser, email)
    }

    function updatePassword(password) {
        return authUpdatePassword(currentUser, password)
    }

    function pushPatientVisitData(data, visitId, patientId) {

        return runTransaction(db, async (transaction) => {
            const patientRef = doc(db, "patients", patientId);
            let patient = await transaction.get(patientRef);

            let control_group = false;

            if (!patient.exists()) {
                //throw new Error("Patient does not exist");
                control_group = true;
                patient = await transaction.get(doc(db, "control_group_patients", patientId));
            }

            const { doctorId } = patient.data();
            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            if (control_group) {
                const docRef = doc(db, `control_group_patients/${patientId}/visits`, visitId);
                return transaction.update(docRef, data);

            }

            const docRef = doc(db, `patients/${patientId}/visits`, visitId);
            return transaction.update(docRef, data);

        });

        //const docRef = doc(db, `patients/${patient_id}/visits`, visit);
        //return setDoc(docRef, data, { merge: true });
    }

    function pullPatientVisitData(visitId, patientId) {
        return runTransaction(db, async (transaction) => {
            const patientRef = doc(db, "patients", patientId);
            let patient = await transaction.get(patientRef);
            let control_group = false;
            if (!patient.exists()) {
                //throw new Error("Patient does not exist");
                control_group = true;
                patient = await transaction.get(doc(db, "control_group_patients", patientId));

            }
            const { doctorId } = patient.data();
            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            if (control_group) {
                const docRef = doc(db, `control_group_patients/${patientId}/visits`, visitId);
                return transaction.get(docRef);
            }
            const docRef = doc(db, `patients/${patientId}/visits`, visitId);
            return transaction.get(docRef);
        });

    }

    function getPatientVisits(patientId) {

        return runTransaction(db, async (transaction) => {

            const patientRef = doc(db, "patients", patientId);
            const patient = await transaction.get(patientRef);

            if (patient.exists()) {

                const visitsRef = collection(db, `patients/${patientId}/visits`);
                const q = query(visitsRef, orderBy("createdAt", 'asc'));
                return getDocs(q);

            } else {
                // if does not exist then should be in control group collection
                const visitsRef = collection(db, `control_group_patients/${patientId}/visits`);
                const q = query(visitsRef, orderBy("createdAt", 'asc'));
                return getDocs(q);
            }

            /*if (!patient.exists()) {
                throw new Error("Patient does not exist");
            }

            const { doctorId } = patient.data();
            if (doctorId !== currentUser.uid) {
                throw new Error("It is not your patient");
            }

            const visitsRef = collection(db, `patients/${patientId}/visits`);
            const q = query(visitsRef, orderBy("createdAt", 'asc'));
            return getDocs(q);*/

        });

        //return getDocs(collection(db, ))
        //return getDocs(query(collection(db, `patients/${patient_id}/visits`), orderBy("createdAt", "asc")));
    }

    function getPatientVisit(patientId, visitId) {
        const docRef = doc(db, `patients/${patientId}/visits`, visitId);
        return getDoc(docRef);
    }

    /**
     * Add new visit in patient visits sub collection
     * @param {*} patientId Patient uid
     * @param {*} visit New data visit
     * @returns transaction Promise set
     */
    function createPatientVisit(patientId, visit) {

        return runTransaction(db, async (transaction) => {

            const patientRef = doc(db, "patients", patientId);

            const patient = await transaction.get(patientRef);

            let { doctorId } = patient.data();

            // check if patient with gived uid exist and has the same doctor id
            if (patient.exists() && doctorId === currentUser.uid) {
                return transaction
                    .set(doc(collection(db, `patients/${patientId}/visits`)), visit);
            } else {
                return transaction
                    .set(doc(collection(db, `control_group_patients/${patientId}/visits`)), visit);
            }
        });

    }

    function removePatientVisit(patientId, visitId) {
        const docRef = doc(db, `patients/${patientId}/visits`, visitId);
        return deleteDoc(docRef);
    }

    function getPatientNotifications() {
        // for each patient return all notifications
        return getDocs(collectionGroup(db, 'notifications'))
    }

    function getPatientNotes(patientId) {
        // read patient notes
        return getDocs(query(collection(db, `patients/${patientId}/notes`), orderBy("time", "desc")));
    }

    function createPatientNote(patientId, data) {
        // crete patient note
        // const docRef = doc(collection(db, `patients/${patientId}/notes`));
        // return setDoc(docRef, data);
        return addDoc(collection(db, `patients/${patientId}/notes`), data);
    }

    function updatePatientNote(patientId, noteId, data) {
        // update patient note
        return updateDoc(doc(db, `patients/${patientId}/notes`, noteId), data);
    }

    function deletePatientNote(patientId, noteId) {
        // delete patient note
        return deleteDoc(doc(db, `patients/${patientId}/notes`, noteId));
    }

    function exportPatientVisits(patients, headers) {
        let host = process.env.REACT_APP_SERVER_URL;
        const api = "export-patient-visits";
        const url = host.concat(api);
        const data = {
            patients: patients, // list of patients id
            headers: headers, // visit fields to recover
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.accessToken}`,
                "Access-Control-Allow-Origin": "*"
            }
        }
        return axios.post(url, data, config);
    }

    function getPatientNutrients(patientId) {

        let host = process.env.REACT_APP_SERVER_URL;

        const api = "nutrients-stats";

        const url = host.concat(api);

        const data = {
            patient_id: patientId,
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.accessToken}`,
                "Access-Control-Allow-Origin": "*"
            }
        }

        return axios.post(url, data, config)

    }

    function getPatientKcals(patientId) {
        let host = process.env.REACT_APP_SERVER_URL;
        const api = "workouts-stats";
        const url = host.concat(api);
        let body = { user_id: patientId }
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.accessToken}`,
                "Access-Control-Allow-Origin": "*",
            }
        }
        return axios.post(url, body, config)
    }

    useEffect(() => {

        localStorage.setItem('lang', currentLanguage);
        Language.setLanguage(currentLanguage);

    }, [currentLanguage]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                console.debug(user?.accessToken);
                setCurrentUser(() => user)
                setLoading(() => false)
            },
            (error) => console.error(error.message),
            () => console.debug("Observer was removed")
        )
        return () => unsubscribe()
    }, []);

    const value = {
        getPatientNotes,
        updatePatientNote,
        deletePatientNote,
        createPatientNote,
        currentUser,
        createPatient,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        createWorkout,
        updateWorkout,
        getWorkouts,
        deleteInBatch,
        getPatientWorkouts,
        getPatients,
        getPatient,
        removePatient,
        unlinkPatient,
        verifyEmail,
        updateProfile,
        updateWorkoutEntry,
        createWorkoutEntry,
        removeWorkoutEntry,
        getPatientNutritionalPlan,
        updatePatientNutritionalPlan,
        createPatientNutritionalPlan,
        getFoods,
        getBackendFoods,
        getFoodEntries,
        newDocRef,
        pushPatientVisitData,
        pullPatientVisitData,
        getUrlNotificationIcon,
        sendNotification,
        getNotifications,
        createNotification,
        updateNotification,
        getPathologies,
        listWorkouts,
        updatePatientAppointments,
        updatePatientWorkouts,
        getPatientNotifications,
        getPatientVisits,
        getDailyPatientNutrients,
        updateSeenNotificationStatus,
        getNutritionalPlanTemplates,
        updateNutritionalPlanTemplate,
        createNutritionalPlanTemplate,
        deleteNutritionalPlanTemplate,
        currentLanguage,
        updateCurrentLanguage,
        getPatientNutrients,
        getPatientKcals,
        updatePatientStatus,
        getPatientVisit,
        createPatientVisit,
        removePatientVisit,
        updatePatient,
        getPatientProtected,
        getStatistics,
        dropOutPatient,
        getDroppedPatients,
        createPatientGroupControl,
        removeControlGroupPatient,
        getPatientById,
        removePathology,
        createPathology,
        updateFood,
        getPathologyById,
        getFoodsAfter,
        getFoodsBefore,
        searchFoodByName,
        getFoodsWithLimit,
        setPatientDroppedOut,
        recoverDroppedPatient,
        exportPatientVisits,
        modifyPatientVisit,
        deletePatientVisit,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
