public with sharing class LeadController {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads() {
        return [SELECT Id, Name, Email, Phone, City, Country, PostalCode, State, Street FROM Lead WHERE OwnerId = :UserInfo.getUserId()];
    }
}