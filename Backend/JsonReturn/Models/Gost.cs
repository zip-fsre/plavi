using System;
using System.Collections.Generic;

namespace JsonReturn.Models;

public partial class Gost
{
    public int Id { get; set; }

    public string? ImeIPrezime { get; set; }

    public string? StatusDolaska { get; set; }

    public int? BrojStola { get; set; }

    public int? IdDogadjajaa { get; set; }

    public virtual Dogadjaj? IdDogadjajaaNavigation { get; set; }
}
