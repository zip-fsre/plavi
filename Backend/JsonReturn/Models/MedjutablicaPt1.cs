using System;
using System.Collections.Generic;

namespace JsonReturn.Models;

public partial class MedjutablicaPt1
{
    public int Id { get; set; }

    public int? IdDogadjaja { get; set; }

    public int? IdPartnera { get; set; }

    public int? IdAranzmana { get; set; }

    public string? StatusPartnera { get; set; }

    public string? Izmjena { get; set; }

    public double? KonacnaCijena { get; set; }

    public double? DodatakNaProviziju { get; set; }

    public virtual Aranzman? IdAranzmanaNavigation { get; set; }

    public virtual Dogadjaj? IdDogadjajaNavigation { get; set; }

    public virtual Partneri? IdPartneraNavigation { get; set; }

    public virtual ICollection<MedjutablicaPt2> MedjutablicaPt2s { get; set; } = new List<MedjutablicaPt2>();
}
