import { Vehicle, BaseInfo } from "@/types/vehicle";

// Dados extraídos da planilha Excel
export const basesData: BaseInfo[] = [
  { nome: "AMBEV RJ", totalVeiculos: 11, veiculosManutencao: 2, veiculosSemMotorista: 0, placas: ["LUJ7E04", "RJM9J25", "RJO5E37", "RJV8H31", "RJY7H07", "RKM9E06", "SQX9A64", "SQZ2C28", "SRB6I72", "SRG6H47", "SRG8I39"] },
  { nome: "BRPR01", totalVeiculos: 3, veiculosManutencao: 0, veiculosSemMotorista: 0, placas: ["RVC0J61", "RVC0J67", "RVC0J69"] },
  { nome: "BRRC01", totalVeiculos: 159, veiculosManutencao: 28, veiculosSemMotorista: 3, placas: ["LUC4H25", "RJE8B50", "RJE8B51", "RJF7I82", "RJW6G71", "RKN8B40", "RTB7E19", "RTM9F11", "RTM9F12", "RTM9F13", "RTO9B22", "RTO9B26", "RTO9B84", "RTT1B43", "RTT1B45", "RTT1B47", "RTT1B48", "RTT1B51", "RUB2D01", "RUN2B45", "RUN2B46", "RUN2B48", "RUN2B49", "RUN2B50", "RUN2B51", "RUN2B52", "RUN2B53", "RUN2B55", "RUN2B56", "RUN2B57", "RUN2B58", "RUN2B60", "RUN2B61", "RUN2B62", "RUN2B63", "RUN2B64", "RUP2B44", "RUP2B45", "RUP2B46", "RUP2B47", "RUP2B49", "RUP2B50", "RUP2B53", "RUP2B56", "RUP4H77", "RUP4H78", "RUP4H81", "RUP4H82", "RUP4H85", "RUP4H87", "RUP4H92", "RUP4H94", "RUQ9D16", "RUW9C02", "RUW9C03", "RVC0J58", "RVC0J59", "RVC0J60", "RVC0J63", "RVC0J64", "RVC0J65", "RVC0J70", "RVC0J71", "RVC0J72", "RVC0J73", "RVC0J74", "RVC0J78", "RVC0J85", "RVC4G70", "RVC4G71", "RVC8B13", "RVG0A14", "RVT2J98", "RVT4F18", "RVT4F19", "RVU9I60", "RVU9I61", "SHB4B37", "SHB4B39", "SHX0J13", "SHX0J14", "SHX0J21", "SHX0J22", "SIA7J06", "STU7F45", "SVK8G96", "TAN6H99", "TAN6I66", "TAO3J94", "TAO4A12", "TAO4E80", "TAO4F05", "TAO4F90", "TAQ4G22", "TAQ4G30", "TAQ4G32", "TAQ4G35", "TAQ4G36", "TAQ4G37", "TAQ6J48", "TAQ6J50", "TAR3C45", "TAR3D02", "TAR3E14", "TAR3E21", "TAR3E25", "RUN2B54", "LUI5D49", "RUP4H76", "RUP4H91", "GFI2G43", "LUJ7E05", "RTM9F14", "RTT1B44", "RUP4H79", "RVT4F20", "RUP4H83", "RTM9F10", "RTT1B46", "RUP4H86", "SHB4B38", "SHB4B36", "LTO7G84", "RJE9F36", "SGL8D26", "SGL8D98", "SGL8E65", "SGL8E73", "SGL8F08", "SGL8F81", "SGL8F88", "SRY5B76", "SST4C72", "SVP9H73", "TAS5A44", "TOG3H62", "TOI7J60", "TOI7J69", "TOI7J93", "TOI8A02", "TOI9E78", "TOI9F51", "TOI9F69", "TOI9F83", "TOI9F92", "TOI9G15", "TOI9G19", "TOI9F96", "TOI9G08", "TOI7J78", "SVF4I52", "SRN7H36", "TOI9G27", "SGL8C62", "SRH4E56"] },
  { nome: "BRRC02", totalVeiculos: 17, veiculosManutencao: 3, veiculosSemMotorista: 1, placas: ["TAN6H93", "TAN6H97", "TAN6I59", "TAN6I62", "TAN6I63", "TAN6I69", "TAN6I71", "TAN6I73", "TAO3I97", "TAO3J93", "TAO3J97", "TAO3J98", "TAO4E89", "TAO4F02", "TAO6E76", "SGL8C96"] },
  { nome: "BRSC02", totalVeiculos: 14, veiculosManutencao: 2, veiculosSemMotorista: 0, placas: ["TAN6I57", "TAO4E90", "TAO4E91", "TAO4E96", "TAO4F04", "TAO6E77", "TAO6E80", "TAO7H46", "TAR3D08", "TAR3E11", "FIY8C71", "FVJ5G72", "TAS4J91", "TAS2J38"] },
  { nome: "BRXMG2", totalVeiculos: 1, veiculosManutencao: 0, veiculosSemMotorista: 0, placas: ["TAS2E58"] },
  { nome: "BRXPR4", totalVeiculos: 10, veiculosManutencao: 2, veiculosSemMotorista: 1, placas: ["SGC2B17", "SGJ9F81", "SGJ9G06", "SGJ9G38", "SGJ9G45", "TAS2E31", "TAS2E35", "TAS2E37", "TAS2E95", "TAS2J37"] },
  { nome: "BRXRS1", totalVeiculos: 16, veiculosManutencao: 1, veiculosSemMotorista: 0, placas: ["GDM8I81", "SSV6C52", "STC6I41", "SUT1B94", "SUT1D83", "SVF2E84", "SVH9G53", "SVL1G82", "SRC8D02", "SRJ7F15", "SRL7D45", "STL5A43", "SVA0J83", "SVG0I32", "STN7I43"] },
  { nome: "BRXSC2", totalVeiculos: 12, veiculosManutencao: 2, veiculosSemMotorista: 0, placas: ["FJE7I82", "FKP9A34", "FPH5I31", "FZG8F72", "GGL2J42", "SSW2I37", "SSZ3D85", "FKR9G52", "FZV6H42", "TAS2J50", "TUE1A37"] },
  { nome: "BRXSP10", totalVeiculos: 25, veiculosManutencao: 1, veiculosSemMotorista: 1, placas: ["LUK7E98", "SQX9A56", "SQX9A61", "SQX9G04", "SRC0I47", "SRG6H41", "SRH6C66", "SRO2J16", "SRU6B80", "SSC1E94", "TAS2F32", "TAS2F83", "TAS2F98", "TAS2J43", "TAS2J45", "TAS4J92", "TAS4J93", "TAS4J94", "TAS4J96", "TAS5A40", "TAS5A41", "TAS5A46", "TAS5A49"] },
  { nome: "Colaborador", totalVeiculos: 17, veiculosManutencao: 0, veiculosSemMotorista: 0, placas: ["KQB9060", "LTW5H89", "LUS7H29", "QUN9C60", "QUT0G45", "RFK1D04", "RGA3C77", "RKP6D39", "RMY8G90", "SGJ2H25", "SGK2G41", "SQZ2D20", "SRF0I64", "SRI2C72", "SRI3J62", "SRJ5D59", "SRR5B38", "SRR5B49", "TOE7E75"] },
];

// Gera veículos com status baseado nos dados
export const vehicles: Vehicle[] = basesData.flatMap(base => 
  base.placas.map((placa, idx) => {
    // Simula status baseado nos números da base
    const isInMaintenance = idx < base.veiculosManutencao;
    const isWithoutDriver = idx >= base.veiculosManutencao && idx < (base.veiculosManutencao + base.veiculosSemMotorista);
    
    let status: "operacao" | "manutencao" | "sem_motorista" = "operacao";
    let motivoManutencao = undefined;
    let dataEntradaManutencao = undefined;
    let previsaoRetorno = undefined;
    
    if (isInMaintenance) {
      status = "manutencao";
      const motivos = ["Manutenção preventiva", "Troca de peças", "Revisão programada", "Reparo de motor", "Manutenção corretiva"];
      motivoManutencao = motivos[Math.floor(Math.random() * motivos.length)];
      const diasAtras = Math.floor(Math.random() * 15) + 1;
      const diasRetorno = Math.floor(Math.random() * 10) + 1;
      dataEntradaManutencao = new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      previsaoRetorno = new Date(Date.now() + diasRetorno * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else if (isWithoutDriver) {
      status = "sem_motorista";
    }
    
    return {
      placa,
      base: base.nome,
      status,
      motivoManutencao,
      dataEntradaManutencao,
      previsaoRetorno
    };
  })
);
