using System.Collections.Generic;

namespace TooShortWillRead.DAL.Models
{
    public class Category
    {
        public string Name { get; set; }

        public virtual ICollection<Article> Articles { get; set; }
    }
}
