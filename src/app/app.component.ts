import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppVersion } from '@ionic-native/app-version';
import { BackgroundMode } from '@ionic-native/background-mode';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';

import { Config } from "../config/config";

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { SenhaAlteracaoPage } from "../pages/senha-alteracao/senha-alteracao";

import { DadosGlobais } from '../models/dados-globais';
import { DadosGlobaisService } from '../services/dados-globais';
import { Chamado } from '../models/chamado';

import { UsuarioService } from '../services/usuario';
import { ChamadoService } from "../services/chamado";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  loginPage = LoginPage;
  homePage = HomePage;
  @ViewChild('nav') nav: NavController;
  dadosGlobais: DadosGlobais;
  chamados: Chamado[];
  task: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private appVersion: AppVersion,
    private events: Events,
    private backgroundMode: BackgroundMode,
    private localNotification: PhonegapLocalNotification,
    
    private dadosGlobaisService: DadosGlobaisService,
    private usuarioService: UsuarioService,
    private menuCtrl: MenuController,
    private chamadoService: ChamadoService
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      this.events.subscribe('login:efetuado', (dadosGlobais: DadosGlobais) => {
        this.dadosGlobais = dadosGlobais;
        this.sincronizarChamados();
      });

      this.events.subscribe('sincronizacao:solicitada', () => {
        this.iniciarSincronizacao();
      });
      
      this.dadosGlobaisService.buscarDadosGlobaisStorage()
        .then((dados) => {
          if (dados) 
            this.dadosGlobais = dados;
            if (dados) {
              if (dados.usuario) {
                this.usuarioService.salvarCredenciais(dados.usuario);
                this.appVersion.getVersionNumber()
                  .then((versaoApp) => {
                    this.dadosGlobais.versaoApp = versaoApp;
                  }).catch(() => {});

                this.menuCtrl.enable(true);
                this.nav.setRoot(this.homePage);

                this.backgroundMode.enable();
                this.backgroundMode.setDefaults(Config.BACKGROUND_MODE_CONFIG);
                
                this.backgroundMode.on("activate")
                  .subscribe(() => { this.iniciarSincronizacao() }
                  , err => {});
                
                this.iniciarSincronizacao();
              } else {
                this.nav.setRoot(this.loginPage);  
              }
            } else {
              this.nav.setRoot(this.loginPage);
            }
        })
        .catch((err) => {});
    });
  }

  private iniciarSincronizacao() {
    if (this.task) {
      clearInterval(this.task);
    }

    this.sincronizarChamados();

    this.task = setInterval(() => {
      this.sincronizarChamados();
    }, Config.INT_SINC_CHAMADOS_MILISEG);
  }

  private sincronizarChamados() {
    this.chamadoService.buscarChamadosApi(this.dadosGlobais.usuario.codTecnico)
      .subscribe((chamadosApi) => {
          this.chamadoService.buscarChamadosStorage()
          .then((chamadosStorage) => {
            this.unificarChamadosApiStorage(chamadosStorage, chamadosApi)
              .then((chamadosUnificados) => {
                this.chamadoService.atualizarChamadosStorage(chamadosUnificados)
                  .then(() => {
                    this.sincronizarChamadosFechados(chamadosUnificados.filter((c) => { 
                      return (c.dataHoraFechamento !== null) })
                    ).then(() => {
                      this.events.publish('sincronizacao:efetuada');
                      console.log('Sincronizacao Efetuada', new Date().toLocaleString('pt-BR'));
                    })
                    .catch();
                  })
                  .catch();
              })
              .catch();
          })
          .catch();
      },
      err => {});
  }

  private unificarChamadosApiStorage(chamadosStorage: Chamado[], chamadosApi: Chamado[]): Promise<Chamado[]> {
    let chamados: Chamado[] = [];
    
    // Chamados adicionados
    chamadosApi.forEach((ca) => {
      if (!chamadosStorage.filter((cs) => { 
        return ( cs.codOs.toString().indexOf( ca.codOs.toString() ) > -1) 
      }).length) {
        chamados.push(ca);
        this.exibirNotificacao('Chamado ' + ca.codOs, 'Novo chamado recebido: ' + ca.codOs);
      }
    });

    // Chamados atualizados ou removidos
    chamadosStorage.forEach((cs) => {
      let found: boolean = false;

      chamadosApi.forEach((ca) => {
        if (cs.codOs == ca.codOs) {
          found = true;

          if ((JSON.stringify(ca) !== JSON.stringify(cs))) {
            Object.keys(ca).forEach((atributo) => {
              if (atributo !== 'codOs' 
                  && atributo !== 'checkin' 
                  && atributo !== 'checkout' 
                  && atributo !== 'rats'
                  && !cs.dataHoraFechamento) {
                cs[atributo] = ca[atributo]; 
              }
            });
          }
        }
      });
      
      if (!found && chamadosApi.length > 0) {
        this.chamadoService.apagarChamadoStorage(cs)
          .then(() => {
            this.exibirNotificacao('Chamado ' + cs.codOs, 'Chamado ' + cs.codOs 
              + ' removido da sua listagem');
          })
          .catch();
      } else {
        chamados.push(cs);
      }
    });

    return new Promise((resolve, reject) => {
      resolve(chamados);
    });
  }

  private sincronizarChamadosFechados(chamados: Chamado[]): Promise<Chamado[]> {
    chamados.forEach((c) => {
      this.chamadoService.fecharChamadoApi(c)
        .subscribe(res => {
          if (res.indexOf('00 - ') !== -1)
            this.exibirNotificacao('Chamado ' + c.codOs + ' sincronizado', res.replace('00 - ', ''))
              .then(() => {
                this.chamadoService.apagarChamadoStorage(c)
                  .then(() => {})
                  .catch(() => {});
              })
              .catch();
          },
          err => {
            this.exibirNotificacao('Erro na Sincronização', 'Chamado ' + c.codOs + ' não foi sincronizado');
          });
    });

    return new Promise((resolve, reject) => {
      resolve(chamados);
    });
  }

  public telaSenhaAlteracao() {
    this.menuCtrl.close().then(() => {
      this.nav.push(SenhaAlteracaoPage);  
    })
  }

  private exibirNotificacao(titulo:string, mensagem: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(
        this.localNotification.requestPermission()
          .then((permission) => {
            if (permission === 'granted') {
              this.localNotification.create(
                titulo, 
                {
                  tag: titulo,
                  body: mensagem,
                  icon: 'assets/icon/favicon.ico'
                }
              );
            }
          })
          .catch()
      );
    });
  }

  public sair() {
    this.dadosGlobaisService.apagarDadosGlobaisStorage()
      .then(() => {
        this.nav.setRoot(this.loginPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}