using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TooShortWillRead.DAL.Models
{
    public class Article
    {
        public Guid Id { get; set; }

        public string Header { get; set; }

        public string Text { get; set; }

        public string ImageName { get; set; }

        public int DataSourceId { get; set; }

        public DataSource DataSource { get; set; }

        public string InternalId { get; set; }

        public virtual ICollection<Category> Categories { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
