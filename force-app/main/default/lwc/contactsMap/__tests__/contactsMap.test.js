import { createElement } from 'lwc';
import ContactsMap from 'c/contactsMap';

describe('c-contacts-map', () => {
    beforeEach(() => {
        console.log('beforeEach');
    });
    
    it('creates a map', () => {
        const element = createElement('c-contacts-map', {
            is: ContactsMap
        });
        document.body.appendChild(element);
        expect(element).toBe(element);
    });
    afterEach(() => {
        console.log('afterEach');
    });
});