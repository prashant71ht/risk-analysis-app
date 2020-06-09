import { Injectable } from '@angular/core';
import { Contact } from './contact';
import { Risk } from './risk';

import { Http, Response } from '@angular/http';

@Injectable()
export class ContactService {
  private userUrl = '/api/user';

  constructor(private http: Http) { }

  // get("/api/user")
  getContacts(): Promise<Contact[]> {
    return this.http.get(this.userUrl)
      .toPromise()
      .then(response => response.json() as Contact[])
      .catch(this.handleError);
  }
  // get("/api/user/riskscore/:id")
  getRiskScore(ssn: string): Promise<Risk> {
    return this.http.get(this.userUrl + '/riskscore/' + ssn)
      .toPromise()
      .then(response => response.json() as Risk)
      .catch(this.handleError);
  }
  // post("/api/user")
  createContact(newContact: Contact): Promise<Contact> {
    return this.http.post(this.userUrl, newContact)
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
  }

  // get("/api/user/:id") endpoint not used by Angular app
  getContactById(contactId: String): Promise<String> {
    return this.http.get(this.userUrl + '/' + contactId)
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
  }

  // delete("/api/user/:id")
  deleteContact(delContactId: String): Promise<String> {
    return this.http.delete(this.userUrl + '/' + delContactId)
      .toPromise()
      .then(response => response.json() as String)
      .catch(this.handleError);
  }

  // put("/api/user/:id")
  updateContact(putContact: Contact): Promise<Contact> {
    // tslint:disable-next-line:prefer-const
    let putUrl = this.userUrl + '/' + putContact._id;
    return this.http.put(putUrl, putContact)
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // tslint:disable-next-line:prefer-const
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }
}
