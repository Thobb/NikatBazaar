using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SolrNet.Impl;
using SolrNet.Commands.Parameters;
using SolrNet.DSL;
using SolrNet.Exceptions;
using NikatBazaar.Search;
using NikatBazaar.ProductSpec;
using NikatBazaar.View;
using SolrNet;
using Newtonsoft.Json;
/// <summary>
/// Summary description for Search
/// </summary>
public class Search
{
	public Search()
	{
		//
		// TODO: Add constructor logic here
		//
	}
    private readonly ISolrReadOnlyOperations<Product> solr;

        public Search(ISolrReadOnlyOperations<Product> solr) {
            this.solr = solr;
        }

        /// <summary>
        /// Builds the Solr query from the search parameters
        /// </summary>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public ISolrQuery BuildQuery(SearchParameters parameters) {
            if (!string.IsNullOrEmpty(parameters.FreeSearch))
                return new SolrQuery(parameters.FreeSearch);
            return SolrQuery.All;
        }

        public ICollection<ISolrQuery> BuildFilterQueries(SearchParameters parameters) {
            var queriesFromFacets = from p in parameters.Facets
                                    select (ISolrQuery)Query.Field(p.Key).Is(p.Value);
            return queriesFromFacets.ToList();
        }


        /// <summary>
        /// All selectable facet fields
        /// </summary>
        private static readonly string[] AllFacetFields = new[] {"cat", "manu_exact"};

        /// <summary>
        /// Gets the selected facet fields
        /// </summary>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public IEnumerable<string> SelectedFacetFields(SearchParameters parameters) {
            return parameters.Facets.Select(f => f.Key);
        }

        public SortOrder[] GetSelectedSort(SearchParameters parameters) {
            return new[] {SortOrder.Parse(parameters.Sort)}.Where(o => o != null).ToArray();
        }

        public string SearchExecute(SearchParameters parameters) {
            try {
                var start = (parameters.PageIndex - 1)*parameters.PageSize;
                var matchingProducts = solr.Query(BuildQuery(parameters), new QueryOptions {
                    FilterQueries = BuildFilterQueries(parameters),
                    Rows = parameters.PageSize,
                    Start = start,
                    OrderBy = GetSelectedSort(parameters),
                    SpellCheck = new SpellCheckingParameters(),
                    Facet = new FacetParameters {
                        Queries = AllFacetFields.Except(SelectedFacetFields(parameters))
                                                                              .Select(f => new SolrFacetFieldQuery(f) {MinCount = 1})
                                                                              .Cast<ISolrFacetQuery>()
                                                                              .ToList(),
                    },
                });
                var view = new ProductView {
                    Products = matchingProducts,
                    Search = parameters,
                    TotalCount = matchingProducts.NumFound,
                    Facets = matchingProducts.FacetFields,
                    DidYouMean = GetSpellCheckingResult(matchingProducts),
                };
                return JsonConvert.SerializeObject(view);
            } catch (InvalidFieldException) {
                return JsonConvert.SerializeObject(new ProductView {
                    QueryError = true,
                });
            }
        }

        private string GetSpellCheckingResult(ISolrQueryResults<Product> products)
        {
            return string.Join(" ", products.SpellChecking
                                        .Select(c => c.Suggestions.FirstOrDefault())
                                        .Where(c => !string.IsNullOrEmpty(c))
                                        .ToArray());
        }
}