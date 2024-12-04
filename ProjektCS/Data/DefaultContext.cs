﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjektCS.Models;

namespace ProjektCS.Data
{
    public class DefaultContext : IdentityDbContext
    {
        public DefaultContext(DbContextOptions<DefaultContext> options)
            : base(options)
        {
        }
        public DbSet<ProjektCS.Models.DOGADJAJ> DOGADJAJ { get; set; } = default!;
        public DbSet<ProjektCS.Models.Partneri> Partneri { get; set; } = default!;
        public DbSet<ProjektCS.Models.Gost> Gost { get; set; } = default!;
        public DbSet<ProjektCS.Models.Playlista> Playlista { get; set; } = default!;
        public DbSet<ProjektCS.Models.Prostor> Prostor { get; set; } = default!;
    }
}
