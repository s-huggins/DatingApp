import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  baseUrl: string = environment.apiUrl;
  faTrashAlt: IconDefinition = faTrashAlt;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  @Input() photos: Photo[];
  mainPhoto: Photo;
  @Output() mainPhotoChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.mainPhoto = this.photos?.find((p) => p.isMain);
    this.initializeUploader();
  }

  setMainPhoto(photo: Photo): void {
    const userId = this.authService.decodedToken['nameid'];
    this.userService.setMainPhoto(userId, photo.id).subscribe(
      () => {
        if (this.mainPhoto) this.mainPhoto.isMain = false;
        photo.isMain = true;
        this.mainPhoto = photo;
        // this.mainPhotoChanged.emit(photo.url);
        this.authService.changeMemberPhoto(photo.url);
      },
      (error) => this.alertify.error(error)
    );
  }

  deletePhoto(photoId: number): void {
    const userId = this.authService.decodedToken['nameid'];
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      this.userService.deletePhoto(userId, photoId).subscribe(
        () => {
          this.photos.splice(
            this.photos.findIndex((p) => p.id === photoId),
            1
          );
          this.alertify.success('Photo has been deleted.');
        },
        () => this.alertify.error('Failed to delete photo')
      );
    });
  }

  private initializeUploader(): void {
    const userId = this.authService.decodedToken['nameid'];
    const userToken = this.authService.userToken;
    this.uploader = new FileUploader({
      url: this.baseUrl + `users/${userId}/photos`,
      authToken: `Bearer ${userToken}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    this.uploader.onAfterAddingFile = (item) => {
      item.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain,
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.mainPhoto = photo;
          this.authService.changeMemberPhoto(photo.url);
        }
      }
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
