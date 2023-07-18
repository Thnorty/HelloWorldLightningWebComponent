public with sharing class LeadController {
  @AuraEnabled(cacheable=true)
  public static List<Lead> getLeads() {
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
        Company,
        Industry,
        Status,
        Rating,
        City,
        Country,
        PostalCode,
        State,
        Street
      FROM Lead
      WHERE OwnerId = :UserInfo.getUserId()
    ];
  }
}
