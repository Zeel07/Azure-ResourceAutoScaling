import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export const AZURE_URL = 'https://assn6.azurewebsites.net';
export const LOCALHOST_URL = 'http://134.190.138.78:5000';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'frontend';
  clean: boolean = false;
  process: boolean = false;
  result: boolean = false;
  filesCount: number;
  TSreq: Date;
  TSresp: Date;
  TSwsStart: Date;
  TSwsEnd: Date;
  totalDelayInMilliSeconds;
  webServiceExecutionDelay;
  webServiceNetworkTransitDelay;
  arrayOfRequest = [];
  arrayOfResponse = [];

  constructor(private httpClient: HttpClient) { }
  submit() {
    this.TSreq = new Date();
    this.arrayOfRequest.push({
      filesCount: this.filesCount,
      clean: this.clean,
      result: this.result
    })
    this.httpClient.post(AZURE_URL + '/processData', {
      filesCount: this.filesCount,
      clean: this.clean,
      result: this.result
    }).subscribe((data: any) => {
      if (data) {
        this.TSwsEnd = new Date(data.TSwsEnd)
        this.TSwsStart = new Date(data.TSwsStart);
        this.TSresp = new Date(); this.totalDelayInMilliSeconds = this.TSresp.getTime() - this.TSreq.getTime();
        this.webServiceExecutionDelay = data.ExecutionDelay;
        this.webServiceNetworkTransitDelay = this.totalDelayInMilliSeconds - this.webServiceExecutionDelay;
        this.arrayOfResponse.push({
          totalDelayInMilliSeconds: this.totalDelayInMilliSeconds,
          webServiceExecutionDelay: this.webServiceExecutionDelay,
          webServiceNetworkTransitDelay: this.webServiceNetworkTransitDelay
        });
        this.httpClient.post(AZURE_URL.concat('/logData'), {
          totalDelayInMilliSeconds: this.totalDelayInMilliSeconds,
          webServiceExecutionDelay: this.webServiceExecutionDelay,
          webServiceNetworkTransitDelay: this.webServiceNetworkTransitDelay
        }).subscribe(data => {
          alert(data);
        })
      }
    })

  }
}
