/**
 * @author lwcc
 * @date 2020
 *
 * @description Demo Chart Data Provider class. Used to get demo values for chart
 */
public inherited sharing class TalendJobDataProvider  {
    
    
    @AuraEnabled(cacheable=true)
    public static String createLabelList(String jobName) {

        String result = '';
        List<Log__c> tmpList = new List <Log__c>([ SELECT Name, createdDate, number__c, execution_time__c  FROM Log__c where type__c = 'Talend Job Execution' AND name like :jobName order by createdDate DESC limit 10 ]);
        if (tmpList.size() > 0) {
            
            result = '[';
            for (Log__c log : tmpList) {

                if (result != '[') {
                    result = result + ',';
                }
                result = result + '"' + String.valueOf(log.createdDate) + '"';
            }
            result = result + ']';
        }
        return result;
    }

    //detailList = '[10, 30, 46, 2, 8, 50, 0]';
    @AuraEnabled(cacheable=true)
    public static String createDetailList(String jobName) {

        String result = '';
        List<Log__c> tmpList = new List <Log__c>([ SELECT Name, createdDate, number__c, execution_time__c  FROM Log__c where name like :jobName order by createdDate DESC limit 10 ]);
        if (tmpList.size() > 0) {
            
            result = '[';
            for (Log__c log : tmpList) {

                if (result != '[') {
                    result = result + ',';
                }
                result = result + String.valueOf(log.execution_time__c);
            }
            result = result + ']';
        }
        return result;
    }

  }