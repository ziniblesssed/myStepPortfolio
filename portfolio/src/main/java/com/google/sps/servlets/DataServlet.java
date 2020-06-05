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

import com.google.sps.servlets.Response;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList; 
import com.google.gson.Gson;
import java.util.List;
import com.google.appengine.api.datastore.FetchOptions;



/** Servlet that handle comments data and return user selected comment */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  DatastoreService datastore;
  private ArrayList<String> messages = new ArrayList<String>();
  private int max;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException { 
   
    Query query = new Query("Response").addSort("timeStamp", SortDirection.DESCENDING);

    datastore = DatastoreServiceFactory.getDatastoreService();   

    int messageChoice = getChoice(request);

    List<Entity> results = datastore.prepare(query).asList(FetchOptions.Builder.withLimit(messageChoice));
    List<Response> messages = new ArrayList<>();
    for (Entity message : results) {
        String firstName = (String) message.getProperty("firstName");
        String lastName = (String) message.getProperty("lastName");
        String country = (String) message.getProperty("country");
        String subject = (String) message.getProperty("subject");


        Response res= new Response(firstName, lastName, country, subject);
        messages.add(res);
    }         
    Gson gson = new Gson();
    String json = gson.toJson(messages);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String firstName = request.getParameter("firstName");
    String lastName =request.getParameter("lastName");
    String country = request.getParameter("country");
    String subject = request.getParameter("subject");
    long timeStamp = System.currentTimeMillis();

    Entity message = new Entity("Response");
    message.setProperty("firstName", firstName);
    message.setProperty("lastName", lastName);
    message.setProperty("country", country);
    message.setProperty("subject",subject);
    message.setProperty("timeStamp", timeStamp);

    datastore.put(message);

    response.sendRedirect("/contact.html");
}

/** Returns the choice entered by the user or -1 if the choice was invalid. */
  private int getChoice(HttpServletRequest request) {
    // Get the input from the form.
    String choiceString = request.getParameter("messageChoice");
    // Convert the input to an int.
    int choice;
    try {
      choice = Integer.parseInt(choiceString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + choiceString);
      return 2;
    }
    
    return choice;
  }

}


