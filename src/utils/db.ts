import {
	CollectionReference,
	DocumentData,
	DocumentReference,
	addDoc,
	collection,
	deleteDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const getCollection = (collectionName: string) => {
	return collection(db, collectionName);
};

export const addToDB = async (collectionRef: CollectionReference<DocumentData, DocumentData>, data: unknown) => {
	await addDoc(collectionRef, data);
};

export const getDataFromDB = async (
	collectionRef: CollectionReference<DocumentData, DocumentData>,
	condition: string,
	data: unknown,
) => {
	return await getDocs(query(collectionRef, where(condition, '==', data)));
};

export const updateData = async (
	docRef: DocumentReference<DocumentData, DocumentData>,
	data: { [x: string]: string | boolean },
) => {
	await updateDoc(docRef, data);
};

export const deleteData = async (docRef: DocumentReference<DocumentData, DocumentData>) => {
	await deleteDoc(docRef);
};
