using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SolrNet.Attributes;

namespace NikatBazaar.ProductSpec
{
    /// <summary>
    /// Summary description for Product
    /// </summary>
    public class Product
    {
        [SolrUniqueKey("id")]
        public string Id { get; set; }

        [SolrField("Vendor")]
        public string Vendor{ get; set; }

        [SolrField("name")]
        public string Name { get; set; }

        [SolrField("manu_exact")]
        public string Manufacturer { get; set; }

        [SolrField("cat")]
        public ICollection<string> Categories { get; set; }

        [SolrField("features")]
        public ICollection<string> Features { get; set; }

        [SolrField("price")]
        public decimal Price { get; set; }

        [SolrField("popularity")]
        public int Popularity { get; set; }

        [SolrField("inStock")]
        public bool InStock { get; set; }

        [SolrField("timestamp")]
        public DateTime Timestamp { get; set; }

        [SolrField("weight")]
        public double? Weight { get; set; }
    }
}