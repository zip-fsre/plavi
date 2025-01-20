using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace JsonReturn.Models;

public partial class Pi02Context : DbContext
{
    public Pi02Context()
    {
    }

    public Pi02Context(DbContextOptions<Pi02Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Aranzman> Aranzmen { get; set; }

    public virtual DbSet<AspNetRole> AspNetRoles { get; set; }

    public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }

    public virtual DbSet<AspNetUser> AspNetUsers { get; set; }

    public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }

    public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }

    public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }

    public virtual DbSet<CitacDogadjaja> CitacDogadjajas { get; set; }

    public virtual DbSet<Dogadjaj> Dogadjajs { get; set; }

    public virtual DbSet<Generalno> Generalnos { get; set; }

    public virtual DbSet<Gost> Gosts { get; set; }

    public virtual DbSet<Izvjesce> Izvjesces { get; set; }

    public virtual DbSet<MedjutablicaPt1> MedjutablicaPt1s { get; set; }

    public virtual DbSet<MedjutablicaPt2> MedjutablicaPt2s { get; set; }

    public virtual DbSet<Partneri> Partneris { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=dosa.fer.hr,3000;Database=PI-02;User Id=PI02;Password=Poo.2-bear;Trusted_Connection=True;Trust Server Certificate=True;Integrated Security=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Croatian_CI_AS");

        modelBuilder.Entity<Aranzman>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ARANZMAN__3214EC27B8B8A97F");

            entity.ToTable("ARANZMAN");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.Cijena).HasColumnName("CIJENA");
            entity.Property(e => e.IdPartnera).HasColumnName("ID_PARTNERA");
            entity.Property(e => e.Opis)
                .HasColumnType("text")
                .HasColumnName("OPIS");

            entity.HasOne(d => d.IdPartneraNavigation).WithMany(p => p.Aranzmen)
                .HasForeignKey(d => d.IdPartnera)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ID_PARTNERA");
        });

        modelBuilder.Entity<AspNetRole>(entity =>
        {
            entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                .IsUnique()
                .HasFilter("([NormalizedName] IS NOT NULL)");

            entity.Property(e => e.Name).HasMaxLength(256);
            entity.Property(e => e.NormalizedName).HasMaxLength(256);
        });

        modelBuilder.Entity<AspNetRoleClaim>(entity =>
        {
            entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

            entity.HasOne(d => d.Role).WithMany(p => p.AspNetRoleClaims).HasForeignKey(d => d.RoleId);
        });

        modelBuilder.Entity<AspNetUser>(entity =>
        {
            entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

            entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                .IsUnique()
                .HasFilter("([NormalizedUserName] IS NOT NULL)");

            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.NormalizedEmail).HasMaxLength(256);
            entity.Property(e => e.NormalizedUserName).HasMaxLength(256);
            entity.Property(e => e.UserName).HasMaxLength(256);

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "AspNetUserRole",
                    r => r.HasOne<AspNetRole>().WithMany().HasForeignKey("RoleId"),
                    l => l.HasOne<AspNetUser>().WithMany().HasForeignKey("UserId"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId");
                        j.ToTable("AspNetUserRoles");
                        j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                    });
        });

        modelBuilder.Entity<AspNetUserClaim>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.AspNetUserClaims).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<AspNetUserLogin>(entity =>
        {
            entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

            entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

            entity.Property(e => e.LoginProvider).HasMaxLength(128);
            entity.Property(e => e.ProviderKey).HasMaxLength(128);

            entity.HasOne(d => d.User).WithMany(p => p.AspNetUserLogins).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<AspNetUserToken>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

            entity.Property(e => e.LoginProvider).HasMaxLength(128);
            entity.Property(e => e.Name).HasMaxLength(128);

            entity.HasOne(d => d.User).WithMany(p => p.AspNetUserTokens).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<CitacDogadjaja>(entity =>
        {
            entity.ToTable("CitacDogadjaja");

            entity.Property(e => e.Id).HasColumnName("ID");
        });

        modelBuilder.Entity<Dogadjaj>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DOGADJAJ__3214EC27DBA79BB2");

            entity.ToTable("DOGADJAJ");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.Datum).HasColumnName("DATUM");
            entity.Property(e => e.Klijent)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("KLIJENT");
            entity.Property(e => e.KontaktKlijenta)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("KONTAKT_KLIJENTA");
            entity.Property(e => e.KontaktSponzora)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("KONTAKT_SPONZORA");
            entity.Property(e => e.Napomena)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NAPOMENA");
            entity.Property(e => e.Naziv)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NAZIV");
            entity.Property(e => e.Svrha)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("SVRHA");
        });

        modelBuilder.Entity<Generalno>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("Generalno");

            entity.Property(e => e.BrojGostiju).HasColumnName("BROJ_GOSTIJU");
            entity.Property(e => e.BrojMjestaPoStolu).HasColumnName("BROJ_MJESTA_PO_STOLU");
            entity.Property(e => e.BrojStola).HasColumnName("BROJ_STOLA");
            entity.Property(e => e.BrojStolova).HasColumnName("BROJ_STOLOVA");
            entity.Property(e => e.CijenaAranzmana).HasColumnName("CIJENA_ARANZMANA");
            entity.Property(e => e.Datum)
                .HasColumnType("datetime")
                .HasColumnName("DATUM");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.Expr14)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Expr19)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Expr8)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.IdAranzmana).HasColumnName("ID_ARANZMANA");
            entity.Property(e => e.IdDogadjaja).HasColumnName("ID_DOGADJAJA");
            entity.Property(e => e.IdJela).HasColumnName("ID_JELA");
            entity.Property(e => e.IdMenija).HasColumnName("ID_MENIJA");
            entity.Property(e => e.IdPartnera).HasColumnName("ID_PARTNERA");
            entity.Property(e => e.IdPredloska).HasColumnName("ID_PREDLOSKA");
            entity.Property(e => e.ImeIPrezime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IME_I_PREZIME");
            entity.Property(e => e.ImeOrganizatora)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("IME_ORGANIZATORA");
            entity.Property(e => e.KonacnaCijena).HasColumnName("KONACNA_CIJENA");
            entity.Property(e => e.KonacnaProvizija).HasColumnName("KONACNA_PROVIZIJA");
            entity.Property(e => e.Kontakt)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("KONTAKT");
            entity.Property(e => e.KontaktOrganizatora)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("KONTAKT_ORGANIZATORA");
            entity.Property(e => e.Lokacija)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("LOKACIJA");
            entity.Property(e => e.Naziv)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("NAZIV");
            entity.Property(e => e.NazivAranzmana)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("NAZIV_ARANZMANA");
            entity.Property(e => e.NazivJela)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("NAZIV_JELA");
            entity.Property(e => e.NazivMenija)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("NAZIV_MENIJA");
            entity.Property(e => e.NazivPlayliste)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("NAZIV_PLAYLISTE");
            entity.Property(e => e.Opis)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("OPIS");
            entity.Property(e => e.OpisAranzmana)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("OPIS_ARANZMANA");
            entity.Property(e => e.ProvizijaAgencije).HasColumnName("PROVIZIJA_AGENCIJE");
            entity.Property(e => e.StatusGosta)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("STATUS_GOSTA");
            entity.Property(e => e.StatusZauzetosti)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("STATUS_ZAUZETOSTI");
            entity.Property(e => e.Svrha)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("SVRHA");
            entity.Property(e => e.UkupanKapacitet).HasColumnName("UKUPAN_KAPACITET");
            entity.Property(e => e.Zanr)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("ZANR");
        });

        modelBuilder.Entity<Gost>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__GOST__3214EC27EE33E96F");

            entity.ToTable("GOST");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.BrojStola).HasColumnName("BROJ_STOLA");
            entity.Property(e => e.IdDogadjajaa).HasColumnName("ID_DOGADJAJAA");
            entity.Property(e => e.ImeIPrezime)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("IME_I_PREZIME");
            entity.Property(e => e.StatusDolaska)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("STATUS_DOLASKA");

            entity.HasOne(d => d.IdDogadjajaaNavigation).WithMany(p => p.Gosts)
                .HasForeignKey(d => d.IdDogadjajaa)
                .HasConstraintName("FK_ID_DOGADJAJAA");
        });

        modelBuilder.Entity<Izvjesce>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__IZVJESCE__3214EC272DB7D227");

            entity.ToTable("IZVJESCE");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.Kraj)
                .HasColumnType("datetime")
                .HasColumnName("KRAJ");
            entity.Property(e => e.Naziv)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NAZIV");
            entity.Property(e => e.Opis)
                .HasColumnType("text")
                .HasColumnName("OPIS");
            entity.Property(e => e.Pocetak)
                .HasColumnType("datetime")
                .HasColumnName("POCETAK");
        });

        modelBuilder.Entity<MedjutablicaPt1>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MEDJUTAB__3214EC279B5C73CA");

            entity.ToTable("MEDJUTABLICA_PT_1");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.DodatakNaProviziju).HasColumnName("DODATAK_NA_PROVIZIJU");
            entity.Property(e => e.IdAranzmana).HasColumnName("ID_ARANZMANA");
            entity.Property(e => e.IdDogadjaja).HasColumnName("ID_DOGADJAJA");
            entity.Property(e => e.IdPartnera).HasColumnName("ID_PARTNERA");
            entity.Property(e => e.Izmjena)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IZMJENA");
            entity.Property(e => e.KonacnaCijena).HasColumnName("KONACNA_CIJENA");
            entity.Property(e => e.StatusPartnera)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("STATUS_PARTNERA");

            entity.HasOne(d => d.IdAranzmanaNavigation).WithMany(p => p.MedjutablicaPt1s)
                .HasForeignKey(d => d.IdAranzmana)
                .HasConstraintName("FK_ID_ARANZMANA");

            entity.HasOne(d => d.IdDogadjajaNavigation).WithMany(p => p.MedjutablicaPt1s)
                .HasForeignKey(d => d.IdDogadjaja)
                .HasConstraintName("FK_ID_DOGADJAJA");

            entity.HasOne(d => d.IdPartneraNavigation).WithMany(p => p.MedjutablicaPt1s)
                .HasForeignKey(d => d.IdPartnera)
                .HasConstraintName("FK_ID_PARTNERAA");
        });

        modelBuilder.Entity<MedjutablicaPt2>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MEDJUTAB__3214EC27065E4987");

            entity.ToTable("MEDJUTABLICA_PT_2");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.IdIzvjesca).HasColumnName("ID_IZVJESCA");
            entity.Property(e => e.IdMedju1).HasColumnName("ID_MEDJU_1");

            entity.HasOne(d => d.IdIzvjescaNavigation).WithMany(p => p.MedjutablicaPt2s)
                .HasForeignKey(d => d.IdIzvjesca)
                .HasConstraintName("FK_ID_IZVJESCA");

            entity.HasOne(d => d.IdMedju1Navigation).WithMany(p => p.MedjutablicaPt2s)
                .HasForeignKey(d => d.IdMedju1)
                .HasConstraintName("FK_ID_MEDJU_1");
        });

        modelBuilder.Entity<Partneri>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PARTNERI__3214EC278F2CE51F");

            entity.ToTable("PARTNERI");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.Napomena)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NAPOMENA");
            entity.Property(e => e.Naziv)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NAZIV");
            entity.Property(e => e.Provizija).HasColumnName("PROVIZIJA");
            entity.Property(e => e.Tip)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("TIP");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
