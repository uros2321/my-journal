import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { FavJournal, Journal, JournalServiceService } from 'src/app/service/journal-service.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
id!:string
currentUserId: string = '';
favJournals: FavJournal[] = [];
journal: Journal ={ id: '', userId: '', title: '', content: '', createdAt: new Date() };
  constructor( private route: ActivatedRoute,private journalService: JournalServiceService, private authService: AuthService,
     private toastCTRL: ToastController, private modalCtrl: ModalController,private navCtrl: NavController) {
    
   }

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.currentUserId = user?.uid || '';
      console.log(this.currentUserId)

      this.journalService.getFavJournals(this.currentUserId).subscribe(favJournals => {
        this.favJournals = favJournals;
        console.log(this.favJournals);
      });
    });
    const id = this.route.snapshot.paramMap.get('id'); // Dobijte id iz parametara rute
    if (id) {
      this.journalService.getJournalById(id).subscribe(res => {
        this.journal = res;
      });
    }
    
  }

  async updateJournal(){
    this.journalService.updateJournal(this.journal)
    const toast= await this.toastCTRL.create({
      message:'Journal updated',
      duration:2000
    })
    toast.present()
  }

  async deleteJournal(){
    await this.journalService.removeJournal(this.id)
    this.navCtrl.back();
  }
  goBack() {
    this.navCtrl.back(); // Funkcija za povratak
  }

  isFavJournal(journal: Journal): boolean {
    return this.favJournals.some(fav => fav.journalId === journal.id);
  }
  toggleFavorite(journal: Journal) {
    // Check if the journal is already in favorites
    if (!this.isFavJournal(journal)) {
      // Create a new FavJournal object with the current journal ID and user ID
      const favJournal = new FavJournal(journal.id || '', this.currentUserId);
  
      // Call the addFavJournal method from the service to save it to the database
      this.journalService.addFavJournal(favJournal).then(async () => {
        // Optionally show a success message
        const toast = await this.toastCTRL.create({
          message: 'Journal added to favorites!',
          duration: 2000
        });
        toast.present();
        
        // After adding, update the favJournals list
        this.journalService.getFavJournals(this.currentUserId).subscribe(favJournals => {
          this.favJournals = favJournals;
        });
      }).catch(async (error) => {
        // Optionally show an error message
        const toast = await this.toastCTRL.create({
          message: error.message,
          duration: 2000
        });
        toast.present();
      });
    }
}

removeFavorite(journal: Journal) {
  // Pronađi omiljeni dnevnik sa odgovarajućim ID-jem
  const favJournalToRemove = this.favJournals.find(fav => fav.journalId === journal.id);

  if (favJournalToRemove) {
    // Pozovi servisnu funkciju za brisanje
    this.journalService.removeFavJournal(favJournalToRemove.id!).then(async () => {
      // Nakon brisanja, ažuriraj listu omiljenih
      this.journalService.getFavJournals(this.currentUserId).subscribe(favJournals => {
        this.favJournals = favJournals;
      });

      // Prikaži poruku o uspešnom brisanju
      const toast = await this.toastCTRL.create({
        message: 'Journal removed from favorites!',
        duration: 2000
      });
      toast.present();
    }).catch(async (error) => {
      // Prikaži grešku ako se desi problem
      const toast = await this.toastCTRL.create({
        message: error.message,
        duration: 2000
      });
      toast.present();
    });
  }
}
}
