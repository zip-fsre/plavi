using System;
using System.Collections.Generic;

namespace JsonReturn.Models;

public partial class Aranzman
{
    public int Id { get; set; }

    public string? Naziv { get; set; }

    public int IdPartnera { get; set; }

    public double? Cijena { get; set; }

    public string? Opis { get; set; }

    public virtual Partneri? IdPartneraNavigation { get; set; } = null!;

    public virtual ICollection<MedjutablicaPt1> MedjutablicaPt1s { get; set; } = new List<MedjutablicaPt1>();
}
