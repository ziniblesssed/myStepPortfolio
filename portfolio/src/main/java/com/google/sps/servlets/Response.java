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

package com.google.sps.servlets;

/** Sets instance Response of a message object */
public final class Response {

  private final long id;
  private final String firstName;
  private final String lastName;
  private final String country;
  private final String subject;
  private final long timeStamp;

  public Response(long id, String firstName, String lastName, String country,String subject,long timeStamp) {
    this.id=id;
    this.firstName= firstName;
    this.lastName= lastName;
    this.country = country;
    this.subject = subject;
    this.timeStamp = timeStamp;
  }
}