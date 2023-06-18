@isTest
private class ContactControllerTest {
    @isTest
    static void testNoContacts() {
        List<Contact> contacts = ContactController.getContacts();
        System.assertEquals(contacts.size(), 0, 'Contacts should be empty');
    }

    @isTest
    static void testOneContact() {
        Contact contact = new Contact();
        contact.FirstName = 'Test';
        contact.LastName = 'Contact';
        contact.MailingCity = ' ';
        contact.MailingCountry = ' ';
        contact.MailingPostalCode = ' ';
        contact.MailingState = ' ';
        contact.MailingStreet = ' ';
        insert contact;

        List<Contact> contacts = ContactController.getContacts();
        System.assertEquals(contacts.size(), 1, 'Contacts should have 1 entry');
    }

    @isTest
    static void testThousandContacts() {
        List<Contact> contactsList = new List<Contact>();
        for (Integer i = 0; i < 1000; i++) {
            Contact contact = new Contact();
            contact.FirstName = 'Test';
            contact.LastName = 'Contact' + i;
            contact.MailingCity = ' ';
            contact.MailingCountry = ' ';
            contact.MailingPostalCode = ' ';
            contact.MailingState = ' ';
            contact.MailingStreet = ' ';
            contactsList.add(contact);
        }
        insert contactsList;

        List<Contact> contacts = ContactController.getContacts();
        System.assertEquals(contacts.size(), 1000, 'Contacts should have 1000 entries');
    }
}