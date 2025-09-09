import { DialogBoxComponent } from "./dialog-box.component";
import { MatDialog } from "@angular/material/dialog";
import { DialogData } from "../../models/dialog-boxVM";
import { Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })

export class DialogBoxServices{
    constructor(private dialog: MatDialog){

    }


showError(title:string, message:string, confirmText: string = "Ok", cancelText: string = "Cancel", showCancel: boolean = false) {
    const data: DialogData = {
      type: 'error',
      title: title,
      message: message,
      confirmText: confirmText,
      cancelText: cancelText,
      showCancel: showCancel
    };

    this.dialog.open(DialogBoxComponent, {
      data,
      width: '300px',
      height: '50px;'
    });
  }

   showValidation(title:string, message:string, confirmText: string = "Ok", cancelText: string = "Cancel", showCancel: boolean = false) {

    const data: DialogData = {
      type: 'validation',
      title: title,
      message: message,
      confirmText: confirmText,
      cancelText: cancelText,
      showCancel: showCancel
    };

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data,
      width: '300px',
      height: '50px;'
    });

     return dialogRef;
  }

  showInfo(title:string, message:string, confirmText: string = "Ok", cancelText: string = "Cancel", showCancel: boolean =false) {

    const data: DialogData = {
      type: 'success',
      title: title,
      message: message,
      confirmText: confirmText,
      cancelText: cancelText,
      showCancel: showCancel
    };

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data,
      width: '300px',
      height: '50px;'
    });

    return dialogRef;
  }
}