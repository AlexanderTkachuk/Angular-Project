import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'wfm-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;
  constructor(
    private userService: UsersService,
    private router: Router,
    private title: Title,
    private meta: Meta
    ) {
      title.setTitle('Регистрация');
      meta.addTags([
        {name:'keyword', content:'регистрация,пароль,имя,email'},
        {name:'description', content:'Страница для регестрации'}
      ])
     }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbbidenEmails.bind(this)),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'name': new FormControl(null, [Validators.required]),
      'agree': new FormControl(false, [Validators.requiredTrue])
    });
  }

  onSubmit() {
    const {
      email, 
      password,
      name
    } = this.form.value;

    const user = new User(email,password,name);
    this.userService.createNewUser(user)
    .subscribe((user: User) => {
      this.router.navigate(['/login'], {
        queryParams: {
          nowCanLogin: true
        }
      });
    })
  }

  forbbidenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getUserByEmail(control.value)
      .subscribe((user:User)=>{
        if(user) {
          resolve({forbbidenEmail : true})
        }
        else {
          resolve(null);
        }
      });
    });
  }

}
