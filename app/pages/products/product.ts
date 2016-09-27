import {ModalController} from 'ionic-angular';
import {NetworkStateModal} from '../../modals/network-state/network-state';
import {TasksModal} from '../../modals/tasks/tasks';

export class ProductCore {
  constructor(private modalCtrl: ModalController) {

  }

  openNetworkStateModal(category: any): void {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: category.workId, categoryName: category.text });
    profileModal.present();
  }

  openTasks(serviceName: string, service: any): void {
    let tasksModal = this.modalCtrl.create(TasksModal, { serviceName, service });
    tasksModal.present();
  }
}
