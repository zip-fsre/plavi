using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjektCS.Models;

namespace ProjektCS.Data
{
    public class GostContext : IdentityDbContext
    {
        public GostContext(DbContextOptions<GostContext> options)
            : base(options)
        {
        }
        public DbSet<ProjektCS.Models.Gost> Gost { get; set; } = default!;
    }
}
