export class NutritionalPlan {
    constructor(param1) {
        this.name1 = param1;
    }
}

// Firestore data converter
export const nutritionalPlanConverter = {
    toFirestore: (np) => {
        return {
            param: np.name1,

        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new NutritionalPlan(data.param);
    }
};

