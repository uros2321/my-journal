import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Klasa koja predstavlja jedan Journal
export class Journal {
  id?: string; // Opcioni identifikator journal-a
  userId: string = ""; // ID korisnika koji je kreirao journal
  title: string = ""; // Naslov journal-a
  content: string = ""; // Sadržaj journal-a
  createdAt: any; // Datum kada je journal kreiran

  constructor(useId: string, title: string, content: string, createdAt: any) {
    this.userId = useId;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }
}

// Klasa koja predstavlja omiljeni Journal korisnika
export class FavJournal {
  id?: string; // Opcioni identifikator omiljenog journal-a
  journalId = ""; // ID journal-a koji je označen kao omiljeni
  userId = ""; // ID korisnika koji je označio journal kao omiljeni

  constructor(journalId: string, userId: string) {
    this.journalId = journalId;
    this.userId = userId;
  }
}

// Servis za upravljanje journal-ima i omiljenim journal-ima
@Injectable({
  providedIn: 'root'
})
export class JournalServiceService {

  userId: any; // ID trenutno prijavljenog korisnika
  title: string = ""; // Naslov journal-a
  content: string = ""; // Sadržaj journal-a

  constructor(private authService: AuthService, private firestore: Firestore) {
    // Preuzmi profil trenutno prijavljenog korisnika
    this.authService.getProfile().then(user => {
      this.userId = user?.uid;
      console.log(this.userId);
    });
  }

  // Funkcija za dodavanje novog journal-a
  addJournal(jornal: Journal) {
    jornal.userId = this.userId; // Postavi ID korisnika koji je kreirao journal
    const jornalRef = collection(this.firestore, "journals"); // Referenca na kolekciju journal-a u Firestore

    return addDoc(jornalRef, jornal); // Dodaj journal u kolekciju
  }

  // Funkcija za dodavanje omiljenog journal-a
  addFavJournal(favJournal: FavJournal) {
    const favJornalRef = collection(this.firestore, 'favJournals'); // Referenca na kolekciju omiljenih journal-a

    // Konvertuj instancu FavJournal u plain objekat
    const favJournalData = {
      journalId: favJournal.journalId,
      userId: favJournal.userId
    };

    return addDoc(favJornalRef, favJournalData); // Dodaj omiljeni journal u kolekciju
  }

  // Funkcija za preuzimanje journal-a po ID korisnika
  getJournal(userId: any): Observable<Journal[]> {
    const journalRef = collection(this.firestore, 'journals'); // Referenca na kolekciju journal-a
    const refquery = query(journalRef, where('userId', '==', this.userId)); // Kreiraj upit za preuzimanje journal-a korisnika
    return collectionData(refquery, { idField: 'id' }) as Observable<Journal[]>; // Vraća observable sa listom journal-a
  }

  // Funkcija za preuzimanje journal-a po ID-u
  getJournalById(id: any): Observable<Journal> {
    const journalRef = doc(this.firestore, `journals/${id}`); // Referenca na dokument journal-a po ID-u
    return docData(journalRef, { idField: 'id' }) as Observable<Journal>; // Vraća observable sa podacima journal-a
  }

  // Funkcija za ažuriranje postojećeg journal-a
  updateJournal(journal: Journal) {
    const journalRef = doc(this.firestore, `journals/${journal.id}`); // Referenca na dokument journal-a
    return updateDoc(journalRef, { title: journal.title, content: journal.content }); // Ažuriraj podatke journal-a
  }

  // Funkcija za brisanje journal-a po ID-u
  removeJournal(id: any) {
    const journalRef = doc(this.firestore, `journals/${id}`); // Referenca na dokument journal-a
    return deleteDoc(journalRef); // Izbriši dokument
  }

  // Funkcija za preuzimanje svih journal-a
  getAllJournals(): Observable<Journal[]> {
    const journalRef = collection(this.firestore, 'journals'); // Referenca na kolekciju journal-a
    return collectionData(journalRef, { idField: 'id' }) as Observable<Journal[]>; // Vraća observable sa listom svih journal-a
  }

  // Funkcija za preuzimanje omiljenih journal-a korisnika
  getFavJournals(userId: string): Observable<FavJournal[]> {
    const favJournalRef = collection(this.firestore, 'favJournals'); // Referenca na kolekciju omiljenih journal-a
    const refquery = query(favJournalRef, where('userId', '==', userId)); // Kreiraj upit za preuzimanje omiljenih journal-a korisnika
    return collectionData(refquery, { idField: 'id' }) as Observable<FavJournal[]>; // Vraća observable sa listom omiljenih journal-a
  }

  // Funkcija za brisanje omiljenog journal-a po ID-u
  removeFavJournal(id: string) {
    const favJournalRef = doc(this.firestore, `favJournals/${id}`); // Referenca na dokument omiljenog journal-a
    return deleteDoc(favJournalRef); // Izbriši dokument
  }

  // Funkcija za preuzimanje journal-a po ID-u korisnika
  getJournalsByUserId(userId: string): Observable<Journal[]> {
    const journalRef = collection(this.firestore, 'journals'); // Referenca na kolekciju journal-a
    const refquery = query(journalRef, where('userId', '==', userId)); // Kreiraj upit za preuzimanje journal-a korisnika
    return collectionData(refquery, { idField: 'id' }) as Observable<Journal[]>; // Vraća observable sa listom journal-a
  }
}

