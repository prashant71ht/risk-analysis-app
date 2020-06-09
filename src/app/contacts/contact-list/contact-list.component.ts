import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { Risk } from '../risk';

@Component({
  selector: 'contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  providers: [ContactService]
})

export class ContactListComponent implements OnInit {

  contacts: Contact[]
  selectedContact: Contact
  risk: Risk
  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.createNewContact()
    this.contactService
      .getContacts()
      .then((contacts: Contact[]) => {
        this.contacts = contacts.map((contact) => {
          if (!contact.phone) {
            contact.phone = {
              mobile: '',
            }
          }
          return contact;
        });
      });
  }

  private getIndexOfContact = (contactId: String) => {
    return this.contacts.findIndex((contact) => {
      return contact._id === contactId;
    });
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact
  }

  getRiskScore(contact) {
    this.contactService.getRiskScore(contact.ssn).then((risk: Risk) => {
      if (risk) {
        this.risk = risk
      }
    });
  }

  createNewContact() {
    // tslint:disable-next-line:prefer-const
    let contact: Contact = {
      name: '',
      email: '',
      ssn: '',
      phone: {
        mobile: ''
      }
    };

    // By default, a newly-created contact will have the selected state.
    this.selectContact(contact);
  }

  deleteContact = (contactId: String) => {
    // tslint:disable-next-line:prefer-const
    let idx = this.getIndexOfContact(contactId);
    if (idx !== -1) {
      this.contacts.splice(idx, 1);
      this.selectContact(null);
    }
    return this.contacts;
  }

  addContact = (contact: Contact) => {
    if (contact) {
      this.contacts.push(contact);
      this.selectContact(contact);
      return this.contacts;
    }

  }

  updateContact = (contact: Contact) => {
    // tslint:disable-next-line:prefer-const
    let idx = this.getIndexOfContact(contact._id);
    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }
    return this.contacts;
  }
}
