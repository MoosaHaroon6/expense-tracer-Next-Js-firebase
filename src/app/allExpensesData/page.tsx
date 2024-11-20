"use client";

import { useCallback, useEffect, useState } from 'react';
import { db } from '@/firebase/firebaseFireStore';
import { onAuthStateChanged, Unsubscribe } from 'firebase/auth';
import { collection, onSnapshot, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { auth } from '@/firebase/firebaseAuth';
import styles from './Expense.module.css';
import Image from 'next/image';
import editImg from "@/images/editImg.png";
import delImg from "@/images/delImg.png";
import { useRouter } from 'next/navigation';


type ExpenseListType = {
    id: string;
    title: string;
    amount: number;
    category: string;
    textArea?: string;
    waqt: string;
    currency: string;
};

type EditFormType = {
    title: string;
    amount: number | '';
    category: string;
    textArea?: string;
    waqt: string;
    currency: string;
};

const monthNames = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October',
    'November', 'December'
];

export default function ExpenseData() {
    const [expenselist, setExpenseList] = useState<ExpenseListType[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<EditFormType>({
        title: '',
        amount: '',
        category: '',
        textArea: '',
        waqt: '',
        currency: ''
    });
    const [choosenCategory, setChoosenCategory] = useState('');
    const [filteredExpenses, setFilteredExpenses] = useState<ExpenseListType[]>([]);
    const [monthRange, setMonthRange] = useState('');
    const [total, setTotal] = useState<number>(0)

    const router = useRouter();

    useEffect(() => {
        const filterExpenses = expenselist.filter(({ category, waqt }) => {
            const expenseDate = new Date(waqt);
            const expenseMonth = monthNames[expenseDate.getMonth()];

            return (
                ((choosenCategory === '' && 'All') || choosenCategory === category) &&
                (monthRange === '' || monthRange === expenseMonth)
            );
        });
        setFilteredExpenses(filterExpenses);

        const totalAmount = () => filterExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotal(totalAmount);
        
    }, [choosenCategory, expenselist, monthRange]);



    const deleteBtn = useCallback(async (expenseId: string) => {
        try {
            await deleteDoc(doc(db, "expenses", expenseId));
        } catch (error) {
            console.error("Error deleting expense: ", error);
        }
    }, []);

    const editBtn = useCallback((index: number) => {
        const expenseToEdit = expenselist[index];
        setEditIndex(index);

        setEditForm({
            title: expenseToEdit.title,
            amount: expenseToEdit.amount,
            category: expenseToEdit.category,
            currency: expenseToEdit.currency,
            textArea: expenseToEdit.textArea || '',
            waqt: expenseToEdit.waqt,
        });
    }, [expenselist]);


    const updateBtn = () => {
        if (editIndex !== null) {
            const updatedExpenses = [...expenselist];
            updatedExpenses[editIndex] = {
                ...updatedExpenses[editIndex],
                ...editForm,
                amount: editForm.amount === '' ? 0 : Number(editForm.amount),
            };
            setExpenseList(updatedExpenses);
            setEditIndex(null);
            setEditForm({ title: '', amount: '', category: '', textArea: '', waqt: '', currency: '' });
        }
    };


    const resetExpenses = async () => {
        const collectionRef = collection(db, "expenses");
        const currentUserUID = auth.currentUser?.uid;
        const condition = where("uid", "==", currentUserUID);
        const q = query(collectionRef, condition);

        const querySnapshot = await getDocs(q);
        const expenseId = querySnapshot.docs.map(doc => doc.id);

        await Promise.all(expenseId.map(async (id) => {
            await deleteDoc(doc(db, "expenses", id));
        }));


        setExpenseList([]);
        setFilteredExpenses([]);
        setChoosenCategory('');
        setMonthRange('');
    };


    useEffect(() => {
        const detachOnAuthListener = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchDataRealTime();
            }
        });

        return () => {
            detachOnAuthListener();
            if (readRealTimeExpenses) {
                readRealTimeExpenses();
            }
        };
    }, []);

    let readRealTimeExpenses: Unsubscribe;

    const fetchDataRealTime = () => {
        const collectionRef = collection(db, "expenses");
        const currentUserUID = auth.currentUser?.uid;
        const condition = where("uid", "==", currentUserUID);
        const q = query(collectionRef, condition);

        readRealTimeExpenses = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const expenseData = change.doc.data();
                    const expense: ExpenseListType = {
                        id: change.doc.id,
                        title: expenseData.title,
                        amount: expenseData.amount,
                        category: expenseData.category,
                        textArea: expenseData.textArea || '',
                        waqt: expenseData.waqt,
                        currency: expenseData.currency
                    };
                    setExpenseList(prev => [...prev, expense]);
                }
                if (change.type === "removed") {
                    const expenseId = change.doc.id;
                    setExpenseList(prev => prev.filter(e => e.id !== expenseId));
                }
            });
        });
    };

    return (
        <div className={styles.expenseContainer}>
            <div>
                <h1 className={styles.expenseTitle}>Your Expenses</h1>
            </div>
            <div className={styles.monthRangeDiv}>
                <label>Select Month: </label>
                <select
                    name="monthRange"
                    value={monthRange}
                    onChange={(e) => { setMonthRange(e.target.value) }}
                    className={styles.monthRange}
                >
                    <option value="">All Months</option>
                    {monthNames.map((month) => (
                        <option value={month} key={month}>{month}</option>
                    ))}
                </select>
                <div className={styles.filterContainer}>
                    <label>Select Category: </label>
                    <select
                        name="filterCategory"
                        value={choosenCategory}
                        onChange={(e) => { setChoosenCategory(e.target.value) }}
                        className={styles.filterContainer}
                    >
                        <option value="All">All</option>
                        <option value="Food">Food</option>
                        <option value="Garments">Garments</option>
                        <option value="Sports">Sports</option>
                        <option value="Transport">Transport</option>
                        <option value="Bills">Bills</option>
                        <option value="Education">Education</option>
                        <option value="Luxuries">Luxuries</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>

            <button className={styles.addExpense} onClick={() => {
                router.push('/home')
            }}>Add Expense</button>

            <br />
            <table className={styles.expenseTable}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>Expense</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Note/Complaint</th>
                        <th>Date/Time</th>
                        <th>Edit/Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredExpenses.length > 0 ? (
                            filteredExpenses.map((expense, index) => (
                                <tr key={expense.id} className={styles.tableRow}>
                                    <td>
                                        {editIndex === index ? (
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => { setEditForm({ ...editForm, title: e.target.value }) }}
                                                className={styles.inputField}
                                            />
                                        ) : (
                                            expense.title
                                        )}
                                    </td>
                                    <td>{editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editForm.amount}
                                            onChange={(e) => { setEditForm({ ...editForm, amount: parseFloat(e.target.value) || '' }) }}
                                            className={styles.inputField}
                                        />
                                    ) : (
                                        `${expense.amount} ${expense.currency}`
                                    )}</td>
                                    <td>{editIndex === index ? (
                                        <select
                                            id="expense-category"
                                            value={editForm.category}
                                            onChange={(e) => { setEditForm({ ...editForm, category: e.target.value }) }}
                                            className={styles.selectField}
                                        >
                                            <option value="Food">Food</option>
                                            <option value="Garments">Garments</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Bills">Bills</option>
                                            <option value="Education">Education</option>
                                            <option value="Luxuries">Luxuries</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    ) : (
                                        expense.category
                                    )}</td>
                                    <td>{editIndex === index ? (
                                        <textarea
                                            name="message-optional"
                                            id="message-optional"
                                            value={editForm.textArea}
                                            onChange={(e) => { setEditForm({ ...editForm, textArea: e.target.value }) }}
                                            className={styles.textArea}
                                        ></textarea>
                                    ) : (
                                        expense.textArea || "N/A"
                                    )}</td>
                                    <td className={styles.dateCell}>
                                        <span className={styles.span}>Date : </span>
                                        {expense.waqt}
                                    </td>
                                    <td>
                                        {editIndex === index ? (
                                            <button className={styles.saveButton} onClick={updateBtn}>Save Changes</button>
                                        ) : (
                                            <>
                                                <button className={styles.editButton} onClick={() => editBtn(index)}>
                                                    <Image
                                                        src={editImg}
                                                        alt="Edit"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </button>
                                                <button className={styles.deleteButton} onClick={() => deleteBtn(expense.id)}>
                                                    <Image
                                                        src={delImg}
                                                        alt="Delete"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className={styles.noDataCell}>No data available</td>
                            </tr>
                        )}
                </tbody>
            </table>
            {filteredExpenses.length > 0 && <button className={styles.resetButton} onClick={resetExpenses}>Reset Expenses</button>}
            {total &&
                <p className={styles.total}>Total :{total} $</p>
            }
        </div >
    );
}
