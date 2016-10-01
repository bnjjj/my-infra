import {ModalController} from 'ionic-angular';
import {NetworkStateModal} from '../../modals/network-state/network-state';

export class ProductCore {
  constructor(private modalCtrl: ModalController) {

  }

  openNetworkStateModal(category: any): void {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: category.workId, categoryName: category.text });
    profileModal.present();
  }
}
