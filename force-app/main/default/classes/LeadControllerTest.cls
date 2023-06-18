@isTest
private class LeadControllerTest {
    @isTest
    static void testNoLeads() {
        List<Lead> leads = LeadController.getLeads();
        System.assertEquals(leads.size(), 0, 'Leads should be empty');
    }

    @isTest
    static void testOneLead() {
        Lead lead = new Lead();
        lead.FirstName = 'Test';
        lead.LastName = 'Lead';
        lead.Company = 'Test Company';
        lead.City = ' ';
        lead.Country = ' ';
        lead.PostalCode = ' ';
        lead.State = ' ';
        lead.Street = ' ';
        insert lead;

        List<Lead> leads = LeadController.getLeads();
        System.assertEquals(leads.size(), 1, 'Leads should have 1 entry');
    }

    @isTest
    static void testThousandLeads() {
        List<Lead> leadsList = new List<Lead>();
        for (Integer i = 0; i < 1000; i++) {
            Lead lead = new Lead();
            lead.FirstName = 'Test';
            lead.LastName = 'Lead' + i;
            lead.Company = 'Test Company' + i;
            lead.City = ' ';
            lead.Country = ' ';
            lead.PostalCode = ' ';
            lead.State = ' ';
            lead.Street = ' ';
            leadsList.add(lead);
        }
        insert leadsList;

        List<Lead> leads = LeadController.getLeads();
        System.assertEquals(leads.size(), 1000, 'Leads should have 1000 entries');
    }
}