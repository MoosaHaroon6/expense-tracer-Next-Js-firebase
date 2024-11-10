import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { auth } from "./firebaseAuth";

export const db = getFirestore(app);

type UserType = {
    email: string;
    uid: string;
}

export async function saveUser(user: UserType) {
    try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, user);
    }
    catch (e) {
        console.log(e);
    }
}

export async function saveExpenses(
    title: string,
    amount: number | null,
    category: string | 'N/A',
    textArea: string,
    waqt: string,
    currency: string
) {
    const uid = auth.currentUser?.uid;

    if (!uid) {
        console.error('User is not authenticated');
        return;
    }

    const newExpenseObject = { title, uid, category, amount, textArea, waqt, currency };

    try {
        const collectionRef = collection(db, "expenses");
        await addDoc(collectionRef, newExpenseObject);
    } catch (error) {
        console.error('Error saving expenses:', error);
    }
}