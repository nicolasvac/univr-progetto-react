import SignUp from "./components/Signup"
import Login from "./components/Login"
import HomePage from "./components/HomePage"
import NutritionalPlan from "./components/NutritionalPlan"
import TemplateNutritionalPlan from './components/NutritionalPlan/TemplateNutritionalPlan'
// import Foods from "./components/Foods"
import Foods from './views/Foods/index'
// import Workouts from "./components/Workouts"
import Workouts from './views/Workouts/index'
import CreatePatient from "./components/create-patient/CreatePatient"
import PatientStatistics from "./components/PatientStatistics"
import TherapyStatus from "./components/TherapyStatus"
import Notifications from "./components/Notifications"
// import NotesPatient from "./views/NotesPatient"
// import NotesPatient from "./components/Notes"
import { PatientNotes } from "./views/Notes"
import Patients from "./views/Patients"
import PhysicalExercises from "./components/PhysicalExercises"
import { ForgotPassword } from "./components/ForgotPassword"
import { Profile } from './components/DoctorProfile'
import { UpdateProfile } from "./components/UpdateProfile"
import { VisitPage } from "./views/Visit/"
import { Visit } from "./components/Visit/"
import PatientDetails from './components/PatientDetails/'
import Data from './components/VisitData'
import Export from "./components/VisitData/Export"
import ModifyPatient from "./views/modify-patient"
import { ControlGroup } from "./views/ControlGroup"
import { DroppedPatients } from "./views/DroppedPatients"
import strings from './components/Language/'

export const authRoutes = [
    {
        path: "/login",
        component: Login
    }, {
        path: "/signup",
        component: SignUp
    }, {
        path: "/forgot-password",
        component: ForgotPassword
    }
]

export const appRoutes = [
    {
        path: "/",
        component: Patients,
        // layout: "/reserved",
        title: strings.pageTitles.patients,
        description: "Lista dei pazienti sotto controllo",
    }, {
        path: "/:patientId/medical-visit",
        component: VisitPage,
        // layout: "/reserved",
        title: strings.pageTitles.medical_visit,
        description: "Visita paziente",
    }, {
        path: "/:patientId/nutritional-plan",
        component: NutritionalPlan,
        // layout: "/reserved",
        title: strings.pageTitles.nutritional_plan,
        description: "Piano nutrizionale raccomandato dal dottore",
    }, {
        path: "/templates-nutritional-plan",
        component: TemplateNutritionalPlan,
        // layout: "/reserved",
        title: strings.pageTitles.nutritional_plans,
        description: "Piani nutrizionali",
    }, {
        path: "/foods",
        component: Foods,
        // layout: "/reserved",
        title: strings.pageTitles.foods,
        description: "Pasti disponibili",
    }, {
        path: "/workouts",
        component: Workouts,
        // layout: "/reserved",
        title: strings.pageTitles.workouts,
        description: "Allenamenti disponibili",
    }, {
        path: "/create-patient",
        component: CreatePatient,
        // layout: "/reserved",
        title: strings.pageTitles.add_patient,
        description: "Registra nuovo paziente alla base di dati",
    }, {
        path: "/statistics",
        component: PatientStatistics,
        // layout: "/reserved",
        title: strings.pageTitles.patient_statistics,
        description: "Statistiche pazienti",
    }, {
        path: "/:patientId/therapy-status",
        component: TherapyStatus,
        // layout: "/reserved",
        title: strings.pageTitles.therapy_status,
        description: "Status terapia",
    }, {
        path: "/:patientId/notifications",
        component: Notifications,
        // layout: "/reserved",
        title: strings.pageTitles.notifications,
        description: "Notifiche",
    }, {
        path: "/physical-exercises",
        component: PhysicalExercises,
        // layout: "/reserved",
        title: strings.pageTitles.physical_exercises,
        description: "Allenamenti del paziente"
    }, {
        path: "/profile",
        component: Profile,
        // layout: "/reserved",
        title: strings.account.profile,
        description: "Profilo dottore",
    }, {
        path: "/update-profile",
        component: UpdateProfile,
        // layout: "/reserved",
        title: strings.pageTitles.update_profile,
        description: "Aggiorna profilo dottore"
    }, {
        path: "/:patientId/patient-details",
        component: PatientDetails,
        // layout: "/reserved",
        title: strings.pageTitles.details_patient,
        description: "Dettagli paziente",
    }, {
        path: "/export",
        component: Data,
        // layout: "/reserved",
        title: strings.pageTitles.export_data,
        description: "Esporta dati visite",
    }, {
        path: "/visit-export",
        component: Export,
        // layout: "/reserved",
        title: strings.pageTitles.export_data,
        description: "Esporta dati",
    }, {
        path: "/:patientId/notes",
        component: PatientNotes,
        // layout: "/reserved",
        title: strings.pageTitles.notes,
        description: "Note del paziente",
    }, {
        path: "/:patientId/visit/:visitId",
        component: Visit,
        // layout: "/reserved",
        title: strings.pageTitles.medical_visit,
        description: "Visita medica",
    }, {
        path: "/:patientId/modify-patient",
        component: ModifyPatient, // use params, get patient data and update
        // layout: "/reserved",
        title: "Modify patient",
        description: "Modifica dati paziente",
    }, {
        path: "/control-group",
        component: ControlGroup,
        // layout: "/reserved",
        title: "Gruppo controllo",
        description: "Gruppo di controllo",
    },
    // {
    //     path: "/dropped-out",
    //     component: DroppedPatients,
    //     title: "Dropped out",
    //     description: "Dropped out patients",
    // },
]