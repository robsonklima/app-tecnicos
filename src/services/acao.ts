import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Storage } from "@ionic/storage";
import 'rxjs/Rx';

import { Config } from './../config/config';
import { Observable } from "rxjs/Observable";
import { Acao } from "../models/acao";

@Injectable()
export class AcaoService {
  private acoes: Acao[] = [];

  constructor(
    private http: Http,
    private storage: Storage
  ) { }

  buscarAcoesApi(): Observable<Acao[]> {
    return this.http.get(Config.API_URL + 'Acao')
      .map((res: Response) => {
        this.insereAcoesStorage(res.json());
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  insereAcoesStorage(acoes: Acao[]) {
    acoes.forEach(acao => {
      if (!this.acaoEstaNoStorage(acao.codAcao)) {
        this.acoes.push(acao);
      }
    });

    this.storage.set('Acoes', this.acoes)
      .then()
      .catch();
  }

  buscarAcoesStorage() {
    return this.storage.get('Acoes')
      .then(
      (acoes: Acao[]) => {
        this.acoes = acoes != null ? acoes : [];
        return this.acoes.slice();
      })
      .catch(
      err => console.log(err)
      );
  }

  acaoEstaNoStorage(codAcao: number): boolean {
    let acaoEncontrada: boolean = false;

    this.acoes.forEach(acao => {
      if (acao.codAcao === codAcao) {
        acaoEncontrada = true;
      }
    });

    return acaoEncontrada;
  }

  apagarAcoesStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      for (var i = 0; i < this.acoes.length; i++) {
        this.acoes.splice(i, 100);
      }

      this.storage.set('Acoes', this.acoes)
        .then((res) => {
          resolve(res);
        })
        .catch(err => console.log(err));
    });
  }

  carregarAcoes(): Promise<Acao[]> {
    return new Promise((resolve, reject) => {
      resolve(this.acoes.slice())
    });
  }

  atualizarCausa(acao: Acao) {
    this.storage.get('Acoes')
      .then((acoes: Acao[]) => {
        acoes.forEach((a, i) => {
          if (acao.codAcao == a.codAcao) {
            this.acoes.splice(i, 1);
            this.acoes.push(acao);
            this.storage.set('Acoes', this.acoes)
              .then(
                () => {}
              )
              .catch(

              );

          }
        });
      })
      .catch();
  }
}