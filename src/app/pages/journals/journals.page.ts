import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { FavJournal, Journal, JournalServiceService } from 'src/app/service/journal-service.service';
import { JournalPage } from '../journal/journal.page';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.page.html',
  styleUrls: ['./journals.page.scss'],
})
export class JournalsPage implements OnInit {

  @ViewChild(IonModal) modal?: IonModal; // Referenca na modal komponentu
  userId: any;
  title: string = "";
  content: string = "";
  journals: Journal[] = [];
  journal!: Journal;
  favJournals: FavJournal[] = [];

  constructor(private authService: AuthService, private journalService: JournalServiceService,
    private toastControl: ToastController, private modalCont: ModalController,
    private navCtrl: NavController) { }

  ngOnInit() {
    // Preuzmi profil trenutno prijavljenog korisnika
    this.authService.getProfile().then(user => {
      this.userId = user?.uid;
      console.log(this.userId);

      // Preuzmi sve journal-e i dodeli ih nizu journals
      this.journalService.getAllJournals().subscribe(res => {
        this.journals = res;
        console.log(this.journals);
      });
    });
  }

  // Funkcija za rukovanje akcijom otkazivanja u modalu
  cancel() {
    this.modal?.dismiss(null, 'cancel'); // Zatvori modal sa razlogom 'cancel'
    this.clearForm(); // Očisti polja forme
  }

  // Funkcija za rukovanje akcijom potvrde u modalu
  confirm() {
    this.modal?.dismiss('confirm'); // Zatvori modal sa razlogom 'confirm'
    this.addJournal(); // Dodaj journal u bazu
    this.clearForm(); // Očisti polja forme
  }

  // Funkcija za dodavanje novog journal-a
  async addJournal() {
    // Pozovi servis za dodavanje journal-a sa trenutnim naslovom i sadržajem
    this.journalService.addJournal({
      userId: "", // Idealno, ovo bi trebalo da bude postavljeno na this.userId
      title: this.title,
      content: this.content,
      createdAt: new Date()
    }).then(async () => {
      // Pokaži poruku uspeha ako je dodavanje journal-a uspešno
      const toast = await this.toastControl.create({
        message: "Journal uspešno dodat!",
        duration: 2000
      });
      toast.present();
    }).catch(async (error) => {
      // Pokaži poruku greške ako dođe do greške
      const toast = await this.toastControl.create({
        message: error,
        duration: 2000
      });
      toast.present();
    });
  }

  // Funkcija za otvaranje stranice sa detaljima određenog journal-a
  openJournal(journal: Journal) {
    this.journal = journal; // Postavi izabrani journal
    this.navCtrl.navigateForward(`/journal/${journal.id}`); // Navigiraj do stranice sa detaljima journal-a
  }

  // Funkcija za čišćenje polja forme
  clearForm() {
    this.title = '';
    this.content = '';
  }
}
