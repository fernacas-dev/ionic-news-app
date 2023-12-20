import { Source } from './../../interfaces/index';
import { Component, Input } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Article } from 'src/app/interfaces';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() index: number = 0;
  @Input() article: Article | undefined;

  constructor(
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController
    ){}

  async openArticle(){

    if( this.platform.is('ios') || this.platform.is('android') ) {
      await Browser.open({ url: this.article?.url!  });
      return
    }

    window.open(this.article?.url, '_blank');
  }


  async onOpenMenu(){

    const buttons = [
      {
        text: 'Favorito',
        icon: 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
        cssClass: 'secondary',
      },
    ];

    const share = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: async() => this.onShareArticle()
    };

    if(this.platform.is('capacitor')) {
      buttons.unshift(share);
    }

    const actionSheet = await this.actionSheetCtrl.create({
        header: 'Opciones',
        buttons: buttons
    });

    await actionSheet.present();
  }

  async onShareArticle(){

    const { title, url, source} = this.article!;

    await Share.share({
      title: title,
      text: source.name!,
      url: url,
      dialogTitle: '',
    });

  }

  onToggleFavorite(){

  }
}
