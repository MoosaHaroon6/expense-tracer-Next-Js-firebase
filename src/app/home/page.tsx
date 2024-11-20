"use client";

import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import { useState } from 'react';
import { saveExpenses } from '@/firebase/firebaseFireStore';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseAuth';

export default function Home() {
    const router = useRouter();   // router called
    const [title, setTitle] = useState(''); // title state handler  
    const [amount, setAmount] = useState<number | '' | null>(null); // updated amount state handler  
    const [category, setCategory] = useState('Food'); // category state handler  
    const [textArea, setTextArea] = useState('');
    const [currency, setCurrency] = useState('﷼');
    const [error, setError] = useState('');

    const logoutHandler = () => {
        signOut(auth)
            .then(() => {
                router.push("/");
                console.log("Logout successful");
            })
            .catch(() => {
                console.log("Logout failed");
            }); // logging out button handler
    };

    const currentTime = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        const formattedTime = currentDate.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div>
            <div className={styles.container}>
                <h1 className={styles.title}>Load Your Expenses</h1>
                <button onClick={logoutHandler} className={styles.buttonLogout}>Log Out</button>
            </div><br />
            <div className={styles.formContainer}>
                <label className={styles.label}>Title : </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                    className={styles.input}
                />

                <br />

                <label className={styles.label}>Amount : </label>
                <input
                    type="number"
                    value={amount !== null && amount !== '' ? amount : ''}
                    onChange={(e) => { setAmount(e.target.value ? parseInt(e.target.value) : '') }}
                    className={styles.input}
                />
                <label>Choose Currency :
                    <select
                        name="currency"
                        value={currency}
                        onChange={(e) => { setCurrency(e.target.value) }}
                        className={`${styles.currency}`}
                    >
                        <option value="﷼">﷼</option>
                        <option value="rs">rs</option>
                        <option value="$">$</option>
                        <option value="€">€</option>
                        <option value="¥">¥</option>
                    </select>
                </label>

                <br />

                <label className={styles.label}>Category : </label>
                <select
                    id="expense-category"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value) }}
                    className={styles.select}
                >
                    <option value="Food">Food</option>
                    <option value="Garments">Garments</option>
                    <option value="Sports">Sports</option>
                    <option value="Transport">Transport</option>
                    <option value="Bills">Bills</option>
                    <option value="Education">Education</option>
                    <option value="Luxuries">Luxuries</option>
                    <option value="Others">Others</option>
                </select>

                <br /><br />

                <label className={styles.label}>Note/Complaint :</label>
                <textarea
                    name="message-optional"
                    id="message-optional"
                    value={textArea}
                    onChange={(e) => { setTextArea(e.target.value) }}
                    className={styles.textarea}
                ></textarea>

                <br /><br />

                <button onClick={
                    async () => {
                        if (title && amount !== null && amount !== '' && category && currency) {
                            const waqt = currentTime();
                            await saveExpenses(title, amount, category, textArea || '', waqt, currency);
                            setTitle('');
                            setAmount(null);
                            setCategory('');
                            setTextArea('');
                            setCurrency('');
                            router.push('/allExpensesData');
                        } else {
                            setError("Please fill required fields to save you expense! ");
                            setTimeout(() => {
                                setError('');
                            }, 2000)
                        }
                    }} className={styles.buttonSave}>Save</button>

                {error &&
                    <p className={styles.error}>{error}</p>
                }

                <br /><br />
                <Link href={"/allExpensesData/"} className={styles.link}>See All Expenses</Link>
            </div>
        </div >
    );
}