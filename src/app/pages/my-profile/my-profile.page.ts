import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { Journal, JournalServiceService } from 'src/app/service/journal-service.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  currentUserId: string = '';
  favJournals: Journal[] = [];
  createdJournals: Journal[] = [];
  favorite = true;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private journalService: JournalServiceService
  ) { }

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.currentUserId = user?.uid || '';

      // Pozivanje servisa da dobijemo omiljene journal-e korisnika
      this.journalService.getFavJournals(this.currentUserId).subscribe(favJournals => {
        const journalIds = favJournals.map(fav => fav.journalId);
        
        // Dohvatanje podataka o tim journal-ima
        this.journalService.getAllJournals().subscribe(allJournals => {
          this.favJournals = allJournals.filter(journal => journalIds.includes(journal.id!));
        });
      });


      this.journalService.getJournalsByUserId(this.currentUserId).subscribe(journals => {
        this.createdJournals = journals;
        console.log('Created Journals:', this.createdJournals);
      });

    });
  }
  goBack() {
    this.navCtrl.back(); // Funkcija za povratak
  }
  openJournal(journal:Journal){
    this.navCtrl.navigateForward(`/journal/${journal.id}`);
  }

  goToFavorites(){
    this.favorite = true;
  }
  goToMyJournals(){
    this.favorite = false;
  }
}
