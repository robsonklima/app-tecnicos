import { CheckinCheckoutService } from '../services/checkin-checkout';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage' 
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from "@angular/http";
//import { AgmCoreModule} from 'angular2-google-maps/core';
import { MyApp } from './app.component';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic'
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';
import { BackgroundMode } from '@ionic-native/background-mode';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';

import { LoginPage } from "../pages/login/login";
import { SenhaAlteracaoPage } from "../pages/senha-alteracao/senha-alteracao";
import { HomePage } from '../pages/home/home';
import { ChamadosPage } from "../pages/chamados/chamados";
import { ChamadoPage } from "../pages/chamado/chamado";
// import { ChamadoMapaPage } from '../pages/chamado-mapa/chamado-mapa';
// import { ChamadosMapaPage } from '../pages/chamados-mapa/chamados-mapa';
import { RatDetalhePage } from "../pages/rat-detalhe/rat-detalhe";
import { RatDetalhePecaPage } from "../pages/rat-detalhe-peca/rat-detalhe-peca";
import { EquipamentosHistoricoPage } from '../pages/equipamentos-historico/equipamentos-historico';

import { DadosGlobaisService } from '../services/dados-globais';
import { ChamadoService } from "../services/chamado";
import { GeolocationService } from './../services/geo-location';
import { UsuarioService } from '../services/usuario';
import { AcaoService } from "../services/acao";
import { DefeitoService } from "../services/defeito";
import { CausaService } from "../services/causa";
import { PecaService } from "../services/peca";
import { TipoServicoService } from "../services/tipo-servico";
import { EquipamentoContratoService } from '../services/equipamento-contrato';
import { EquipamentoHistoricoPage } from '../pages/equipamento-historico/equipamento-historico';
import { PecasPage } from '../pages/pecas/pecas';

import { CapitalizePipe } from '../pipes/capitalize';
import { EllipsisPipe } from '../pipes/ellipsis';
import { LowercasePipe } from '../pipes/lowercase';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SenhaAlteracaoPage,
    HomePage,
    ChamadosPage,
    // ChamadosMapaPage,
    ChamadoPage,
    // ChamadoMapaPage,
    RatDetalhePage,
    RatDetalhePecaPage,
    EquipamentosHistoricoPage,
    EquipamentoHistoricoPage,
    PecasPage,
    CapitalizePipe,
    EllipsisPipe,
    LowercasePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      monthNames: ['janeiro', 'fevereiro', 'mar\u00e7o', 'abril', 'maio', 'junho', 
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ],
      monthShortNames: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago',
         'set', 'out', 'nov', 'dez' ],
      dayNames: ['domingo', 'segunda-feira', 'ter\u00e7a-feira', 'quarta-feira',
         'quinta-feira', 'sexta-feira', 'sabado' ],
      dayShortNames: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab' ],
      scrollAssist: false, 
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot()
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAaNHr89Vf3e-4SbWeAZPqWI1wMeJu5CY4'
    // })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SenhaAlteracaoPage,
    HomePage,
    ChamadosPage,
    // ChamadosMapaPage,
    ChamadoPage,
    // ChamadoMapaPage,
    RatDetalhePage,
    RatDetalhePecaPage,
    EquipamentosHistoricoPage,
    EquipamentoHistoricoPage,
    PecasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Diagnostic,
    Geolocation,
    BackgroundMode,
    PhonegapLocalNotification,
    Network,
    AppVersion,
    DadosGlobaisService,
    ChamadoService,
    GeolocationService,
    UsuarioService,
    AcaoService,
    DefeitoService,
    CausaService,
    PecaService,
    EquipamentoContratoService,
    TipoServicoService,
    CheckinCheckoutService
  ]
})
export class AppModule {}