public with sharing class ContactController {
  @AuraEnabled(cacheable=true)
  public static List<Contact> getContacts() {
    return [
      SELECT
        Id,
        PhotoUrl,
        Name,
        Email,
        Phone,
        MobilePhone,
        Title,
        LeadSource,
        AccountId,
        MailingCity,
        MailingCountry,
        MailingPostalCode,
        MailingState,
        MailingStreet
      FROM Contact
      WHERE OwnerId = :UserInfo.getUserId()
    ];
  }
}
