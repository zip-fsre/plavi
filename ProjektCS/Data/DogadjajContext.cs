using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjektCS.Models;

namespace ProjektCS.Data
{
    public class DogadjajContext : IdentityDbContext
    {
        public DogadjajContext(DbContextOptions<DogadjajContext> options)
            : base(options)
        {
        }
        public DbSet<ProjektCS.Models.DOGADJAJ> DOGADJAJ { get; set; } = default!;
    }
}
