import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../shared/services/auth.service';
import { fadeStateTrigger } from '../../shared/animations/fade.animation';

@Component({
  selector: 'wfm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeStateTrigger]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  message: Message;

  constructor(
    private userSrvice: UsersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {
    
    title.setTitle('Вход в систему');
    meta.addTags([
      {
        name: 'keywords', content: 'логин,вход,система'
      },
      {
        name: 'description', content: 'Страница для входа в систему'
      }
    ])
   }

  ngOnInit() {
    this.message = new Message('danger', '');

    this.route.queryParams
    .subscribe((params: Params) => {
      if(params['nowCanLogin']) {
        this.showMessage(
          {
            text: 'Теперь вы можете зайти в систему',
            type:'success'
        });
      }
      else if (params['accessDenied']) {
        this.showMessage(
          {
            text: 'Для работы  с системой вам нужно войти в личный кабинет',
            type:'warning'
        });
      }
    })
    //нужно проинициализировать message = new Message('тип', 'текст')

    
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  private showMessage(message: Message) {
    this.message = message;
    window.setTimeout(() => {
      this.message.text = '';
    }, 3000)
  }

  onSubmit() {
    //берём значение с формы
    const formData = this.form.value;
    
    //вызывает метод с сервиса getUserByEmail и передаём в него email  с формы
    this.userSrvice.getUserByEmail(formData.email)
    .subscribe((user: User) => {
      //проверяем, получаем ли вы вообще какого-то юзера
      if(user) {
        //проверяем, совпадает ли emailс формы с email-ом полученым с сервера 
        if(user.password === formData.password) {
          this.message.text = '';
          window.localStorage.setItem('user', JSON.stringify(user));
          this.authService.login();

          //редирект к другой странице
          this.router.navigate(['/system', 'bill']);
        } 
        else{
          this.showMessage(
            {
              text:'Пароль не верный!',
              type: 'danger'
          });
        }
      }

      else {
        this.showMessage(
          {
            text: 'Такого польщователя нe сущесттвует!',
            type: 'danger'
        });
      }
    })
  }

}
