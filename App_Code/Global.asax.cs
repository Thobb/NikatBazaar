/// <summary>
/// Summary description for Global
/// </summary>

using System;
using System.Web;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Routing;
using Microsoft.Practices.ServiceLocation;
using NikatBazaar.ProductSpec;
using SolrNet;
using SolrNet.Commands.Parameters;
using SolrNet.Exceptions;
using SolrNet.Impl;
namespace NikatBazaar
{
    public class NBGlobal : HttpApplication
    {
        public NBGlobal()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        void Application_Start(object sender, EventArgs e)
        {
            string solrURL = ConfigurationManager.AppSettings["solrUrl"];
            var connection = new SolrConnection(solrURL);
            var loggingConnection = new LoggingConnection(connection);
            Startup.Init<Product>(loggingConnection); 
        }

       

        void Application_End(object sender, EventArgs e)
        {
            //  Code that runs on application shutdown

        }

        void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs

        }

        void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started

        }

        void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends. 
            // Note: The Session_End event is raised only when the sessionstate mode
            // is set to InProc in the Web.config file. If session mode is set to StateServer 
            // or SQLServer, the event is not raised.

        }
    }
}