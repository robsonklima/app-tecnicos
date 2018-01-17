import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Storage } from "@ionic/storage";
import 'rxjs/Rx';

import { Config } from './../config/config';
import { Observable } from "rxjs/Observable";
import { DadosGlobais } from '../models/dados-globais';

@Injectable()
export class DadosGlobaisService {
  dadosGlobais: DadosGlobais;

  constructor(
    private http: Http,
    private storage: Storage
  ) { }

  insereDadosGlobaisStorage(dadosGlobais: DadosGlobais) {
    this.dadosGlobais = dadosGlobais;

    this.storage.set('DadosGlobais', this.dadosGlobais)
      .then()
      .catch();
  }

  buscarDadosGlobaisStorage() {
    return this.storage.get('DadosGlobais')
      .then((dg: DadosGlobais) => {
        this.dadosGlobais = dg != null ? dg : null;
        return this.dadosGlobais;
      })
      .catch(
        err => console.log(err)
      );
  }

  apagarDadosGlobaisStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set('DadosGlobais', null)
        .then((res) => {
          resolve(res);
        })
        .catch(err => console.log(err));
    });
  }

  buscarUltimaVersaoApp(): Observable<string> {
    return this.http.get(Config.API_URL + 'SatMobileAppVersao/')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}