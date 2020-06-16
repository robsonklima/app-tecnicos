import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

import { Config } from '../models/config';

import { Observable } from "rxjs/Observable";
import { PontoData } from '../models/ponto-data';


@Injectable()
export class PontoDataService {
  constructor(
    private http: Http
  ) {}

  buscarPontosDataPorUsuario(codUsuario: string): Observable<PontoData[]> {
    return this.http.get(Config.API_URL + 'PontoData/' + codUsuario)
      .timeout(10000)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}