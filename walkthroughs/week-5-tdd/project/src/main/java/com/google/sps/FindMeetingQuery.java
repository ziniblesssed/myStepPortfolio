// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
 
package com.google.sps;
import java.util.*;
 
 
public final class FindMeetingQuery {
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        int meetingTime = (int) request.getDuration();
        Collection<String> attendees = request.getAttendees();
        ArrayList<TimeRange> availableTime = new ArrayList<TimeRange>();
        int startTime = TimeRange.START_OF_DAY;        
        Set<TimeRange> notAvailableTime = new HashSet<TimeRange>();

        //Loop through events to find conflicting time
        for (Event event : events){         
            TimeRange when = event.getWhen();
            Set<String> eventAttendees = event.getAttendees();
            //Check if event Attendee is part of current event
            if (!(Collections.disjoint(attendees,event.getAttendees()))){
                 //Check if start time is before even started so it doesn't overlap
                 if (startTime < when.start()) {
                    TimeRange availTime = TimeRange.fromStartEnd(startTime, when.start(), false);    
                    //Check if theres enough time for the
                    // meeting before adding the time to available time
                    if (availTime.duration() >= meetingTime){
                        availableTime.add(availTime);
                    }
                } 
                if (startTime < when.end()) {
                startTime= when.end();
                }                        
            }
        }
        //Check for last possible time for the meeting if not at the end of the day
        if(startTime < TimeRange.END_OF_DAY) {
            TimeRange availTime = TimeRange.fromStartEnd(startTime, TimeRange.END_OF_DAY, true);
            if(availTime.duration() >= meetingTime){
                    availableTime.add(availTime);
                }
        }       
        return availableTime;
    }
}