using AutoMapper;
using KanbanApi.DTOs;
using KanbanApi.Entities;

namespace KanbanApi.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Produto
        CreateMap<Produto, ProdutoDto>();
        CreateMap<CreateProdutoDto, Produto>();
        CreateMap<UpdateProdutoDto, Produto>();

        // Palete
        CreateMap<Palete, PaleteDto>()
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status.ToString()))
            .ForMember(d => d.ProdutoNome, opt => opt.MapFrom(s => s.Produto.Nome))
            .ForMember(d => d.ProdutoSku, opt => opt.MapFrom(s => s.Produto.Sku));

        // Movimentacao
        CreateMap<Movimentacao, MovimentacaoDto>()
            .ForMember(d => d.Tipo, opt => opt.MapFrom(s => s.Tipo.ToString()))
            .ForMember(d => d.PaleteUid, opt => opt.MapFrom(s => s.Palete.Uid));
    }
}
