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
import java.util.ArrayList; // import the ArrayList class
import com.google.gson.Gson;
import java.util.List;



/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  private ArrayList<String> messages = new ArrayList<String>();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException { 

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    //Response is a java file that contains which an object message
    PreparedQuery results = datastore.prepare(new Query("Response"));

    List<Response> messages = new ArrayList<>();
    for (Entity message : results.asIterable()) {
        String firstname = (String) message.getProperty("firstname");
        String lastname = (String) message.getProperty("lastname");
        String country = (String) message.getProperty("country");
        String subject = (String) message.getProperty("subject");

        Response res= new Response(firstname, lastname, country, subject);
        messages.add(res);
    }
         
    Gson gson = new Gson();
    String json = gson.toJson(messages);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String firstname = request.getParameter("firstname");
    String lastname =request.getParameter("lastname");
    String country = request.getParameter("country");
    String subject = request.getParameter("subject");

    Entity message = new Entity("Response");
    message.setProperty("firstname", firstname);
    message.setProperty("lastname", lastname);
    message.setProperty("country", country);
    message.setProperty("subject",subject);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(message);
    


    response.sendRedirect("/contact.html");
}
}


