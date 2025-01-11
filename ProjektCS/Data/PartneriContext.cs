using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjektCS.Models;

namespace ProjektCS.Data
{
    public class PartneriContext : IdentityDbContext
    {
        public PartneriContext(DbContextOptions<PartneriContext> options)
            : base(options)
        {
        }
        public DbSet<ProjektCS.Models.Partneri> Partneri { get; set; } = default!;
    }
}
