import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN1szydZtW4nPKljzuRBhAaS8-TAi80_A",
  authDomain: "aztlan-vita-f.firebaseapp.com",
  projectId: "aztlan-vita-f",
  storageBucket: "aztlan-vita-f.firebasestorage.app",
  messagingSenderId: "208667110722",
  appId: "1:208667110722:web:35c751ef6032483069ecdb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function guardarPaciente(paciente) {
  await setDoc(doc(db, "pacientes", paciente.codigo), paciente);
}

export async function actualizarPaciente(codigo, datos) {
  await updateDoc(doc(db, "pacientes", codigo), datos);
}

export function escucharPacientes(callback, onError) {
  return onSnapshot(collection(db, "pacientes"), (snapshot) => {
    callback(snapshot.docs.map((d) => d.data()));
  }, onError);
}

export function escucharPaciente(codigo, callback, onError) {
  return onSnapshot(doc(db, "pacientes", codigo), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  }, onError);
}
