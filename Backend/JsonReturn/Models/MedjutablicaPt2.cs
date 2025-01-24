using System;
using System.Collections.Generic;

namespace JsonReturn.Models;

public partial class MedjutablicaPt2
{
    public int Id { get; set; }

    public int? IdMedju1 { get; set; }

    public int? IdIzvjesca { get; set; }

    public virtual Izvjesce? IdIzvjescaNavigation { get; set; }

    public virtual MedjutablicaPt1? IdMedju1Navigation { get; set; }
}
