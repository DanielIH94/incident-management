using {sap.capire.incidents as my} from '../db/schema';

service ProcessorService {
  @readonly
  entity Customers     as projection on my.Customers;

  entity Incidents     as projection on my.Incidents;
  entity Conversations as projection on my.Conversations;
}

annotate ProcessorService.Incidents with @odata.draft.enabled;
annotate ProcessorService with @(requires: ['support']);


extend projection ProcessorService.Customers with {
  firstName || ' ' || lastName as name : String
}
